import pool from '@/lib/db';
import {
  buildSeedIntegrations,
  companyIdForUser,
  generateInviteToken,
  generatePairingCode,
  PROVIDER_DEFAULT_DEPARTMENTS,
  type CompanyIntegration,
  type IntegrationProvider,
  type IntegrationStatus,
} from '@/lib/companyIntegrations';

function asDeptList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function mapRow(row: Record<string, unknown>): CompanyIntegration {
  const meta = row.auth_metadata;
  return {
    id: String(row.id),
    companyId: String(row.company_id),
    provider: row.provider as IntegrationProvider,
    status: row.status as IntegrationStatus,
    assignedDepartments: asDeptList(row.assigned_departments),
    authMetadata:
      meta && typeof meta === 'object' && !Array.isArray(meta)
        ? (meta as Record<string, unknown>)
        : {},
    lastSyncAt: row.last_sync_at ? new Date(String(row.last_sync_at)).toISOString() : null,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

export async function listCompanyIntegrations(userId: number): Promise<CompanyIntegration[]> {
  const companyId = companyIdForUser(userId);
  const [rows]: any = await pool.query(
    `SELECT * FROM company_integrations
     WHERE company_id = ?
     ORDER BY created_at ASC`,
    [companyId]
  );

  if (!rows?.length) {
    await seedCompanyIntegrations(userId);
  } else {
    await ensureMissingProviders(userId, rows.map(mapRow));
  }

  const [finalRows]: any = await pool.query(
    `SELECT * FROM company_integrations WHERE company_id = ? ORDER BY created_at ASC`,
    [companyId]
  );
  return (finalRows || []).map(mapRow);
}

async function ensureMissingProviders(userId: number, existing: CompanyIntegration[]) {
  const have = new Set(existing.map((item) => item.provider));
  const companyId = companyIdForUser(userId);
  for (const item of buildSeedIntegrations(companyId)) {
    if (have.has(item.provider)) continue;
    await pool.query(
      `INSERT INTO company_integrations
         (company_id, user_id, provider, status, assigned_departments, auth_metadata, last_sync_at)
       VALUES (?, ?, ?, ?, ?::jsonb, ?::jsonb, ?)
       ON CONFLICT (company_id, provider) DO NOTHING`,
      [
        companyId,
        userId,
        item.provider,
        item.status === 'connected' ? 'disconnected' : item.status,
        JSON.stringify(item.assignedDepartments),
        JSON.stringify(item.authMetadata),
        null,
      ]
    );
  }
}

async function seedCompanyIntegrations(userId: number) {
  const companyId = companyIdForUser(userId);
  for (const item of buildSeedIntegrations(companyId)) {
    await pool.query(
      `INSERT INTO company_integrations
         (company_id, user_id, provider, status, assigned_departments, auth_metadata, last_sync_at)
       VALUES (?, ?, ?, ?, ?::jsonb, ?::jsonb, ?)
       ON CONFLICT (company_id, provider) DO NOTHING`,
      [
        companyId,
        userId,
        item.provider,
        item.status,
        JSON.stringify(item.assignedDepartments),
        JSON.stringify(item.authMetadata),
        item.lastSyncAt,
      ]
    );
  }
}

export async function getIntegrationById(
  userId: number,
  id: string
): Promise<CompanyIntegration | null> {
  const companyId = companyIdForUser(userId);
  const [rows]: any = await pool.query(
    `SELECT * FROM company_integrations WHERE id = ? AND company_id = ? LIMIT 1`,
    [id, companyId]
  );
  if (!rows?.[0]) return null;
  return mapRow(rows[0]);
}

export async function upsertProviderStatus(
  userId: number,
  provider: IntegrationProvider,
  status: IntegrationStatus,
  metadataPatch: Record<string, unknown> = {}
): Promise<CompanyIntegration> {
  const companyId = companyIdForUser(userId);
  const existing = await listCompanyIntegrations(userId);
  const current = existing.find((item) => item.provider === provider);
  const nextMeta = {
    ...(current?.authMetadata || { mock: true }),
    ...metadataPatch,
  };
  const lastSync = status === 'connected' ? new Date().toISOString() : current?.lastSyncAt || null;
  const departments =
    current?.assignedDepartments?.length
      ? current.assignedDepartments
      : PROVIDER_DEFAULT_DEPARTMENTS[provider];

  const [rows]: any = await pool.query(
    `INSERT INTO company_integrations
       (company_id, user_id, provider, status, assigned_departments, auth_metadata, last_sync_at, updated_at)
     VALUES (?, ?, ?, ?, ?::jsonb, ?::jsonb, ?, CURRENT_TIMESTAMP)
     ON CONFLICT (company_id, provider) DO UPDATE SET
       status = EXCLUDED.status,
       auth_metadata = COALESCE(company_integrations.auth_metadata, '{}'::jsonb) || EXCLUDED.auth_metadata,
       last_sync_at = COALESCE(EXCLUDED.last_sync_at, company_integrations.last_sync_at),
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [
      companyId,
      userId,
      provider,
      status,
      JSON.stringify(departments),
      JSON.stringify(nextMeta),
      lastSync,
    ]
  );

  return mapRow(rows[0]);
}

export async function refreshWhatsappPairing(userId: number): Promise<CompanyIntegration> {
  const code = generatePairingCode();
  return upsertProviderStatus(userId, 'whatsapp', 'action_required', {
    pairingCode: code,
    pairingExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    mock: true,
  });
}

export async function confirmWhatsappPairing(userId: number): Promise<CompanyIntegration> {
  return upsertProviderStatus(userId, 'whatsapp', 'connected', {
    channelLabel: 'Saha WhatsApp hattı',
    listening: true,
    mock: true,
  });
}

export async function createItDelegation(
  userId: number,
  input: {
    itName: string;
    itEmail: string;
    systems: string[];
  }
): Promise<{ integration: CompanyIntegration; inviteUrl: string }> {
  const token = generateInviteToken();
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
  const integration = await upsertProviderStatus(userId, 'custom_it', 'pending_it', {
    itName: input.itName,
    itEmail: input.itEmail,
    systems: input.systems,
    inviteToken: token,
    inviteExpiresAt: expiresAt,
    mock: true,
  });

  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    process.env.NEXTAUTH_URL?.replace(/\/$/, '') ||
    'http://127.0.0.1:18080';

  return {
    integration,
    inviteUrl: `${base}/agent/manage/integrations?itInvite=${token}`,
  };
}

export async function toggleDepartments(
  userId: number,
  id: string,
  assignedDepartments: string[]
): Promise<CompanyIntegration | null> {
  const companyId = companyIdForUser(userId);
  const [rows]: any = await pool.query(
    `UPDATE company_integrations
     SET assigned_departments = ?::jsonb,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND company_id = ?
     RETURNING *`,
    [JSON.stringify(assignedDepartments), id, companyId]
  );
  if (!rows?.[0]) return null;
  return mapRow(rows[0]);
}

export async function disconnectProvider(
  userId: number,
  provider: IntegrationProvider
): Promise<CompanyIntegration> {
  return upsertProviderStatus(userId, provider, 'disconnected', { mock: true });
}
