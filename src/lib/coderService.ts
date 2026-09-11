/**
 * Coder v2 REST API istemcisi — izole geliştirici workspace yönetimi.
 *
 * Ortam:
 *   CODER_URL / CODER_INTERNAL_URL — sunucu API (compose: http://coder:7080)
 *   CODER_API_TOKEN    — Coder Session / API token
 *   CODER_TEMPLATE_ID  — blacknook-dev şablon UUID
 *   NEXT_PUBLIC_CODER_URL — tarayıcı erişim URL'si
 */

import { existsSync } from 'fs';

export type CoderWorkspaceStatus =
  | 'pending'
  | 'starting'
  | 'running'
  | 'stopping'
  | 'stopped'
  | 'failed'
  | 'canceling'
  | 'canceled'
  | 'deleting'
  | 'deleted'
  | 'unknown';

export type WorkspaceInfo = {
  id: string;
  name: string;
  status: CoderWorkspaceStatus;
  healthy: boolean;
  ownerName?: string;
  /** Tarayıcıda açılacak URL (Coder UI veya code-server app) */
  accessUrl: string | null;
  updatedAt?: string;
};

type CoderApiWorkspace = {
  id: string;
  name: string;
  owner_name?: string;
  status?: string;
  health?: { healthy?: boolean };
  latest_build?: {
    status?: string;
    transition?: string;
    job?: { status?: string };
  };
  updated_at?: string;
};

function isLikelyDockerRuntime(): boolean {
  try {
    return existsSync('/.dockerenv');
  } catch {
    return false;
  }
}

function isLoopbackCoderUrl(url: string): boolean {
  return /^(https?:\/\/)?(127\.0\.0\.1|localhost)(:|\/|$)/i.test(url);
}

function coderBaseUrl() {
  const internal = (process.env.CODER_INTERNAL_URL || '').trim().replace(/\/$/, '');
  const configured = (process.env.CODER_URL || '').trim().replace(/\/$/, '');
  // Compose app konteynerinde 127.0.0.1 Coder’a ulaşmaz — sibling DNS kullan.
  if (internal) return internal;
  if (configured && !(isLikelyDockerRuntime() && isLoopbackCoderUrl(configured))) {
    return configured;
  }
  if (isLikelyDockerRuntime()) return 'http://coder:7080';
  return configured || 'http://127.0.0.1:7080';
}

function publicCoderUrl() {
  return (
    process.env.NEXT_PUBLIC_CODER_URL ||
    process.env.CODER_ACCESS_URL ||
    'http://127.0.0.1:7080'
  ).replace(/\/$/, '');
}

function requireConfig() {
  const token = process.env.CODER_API_TOKEN?.trim();
  const templateId = process.env.CODER_TEMPLATE_ID?.trim();
  if (!token) {
    throw new Error('CODER_API_TOKEN tanımlı değil. Coder UI’dan API token oluşturun.');
  }
  if (!templateId) {
    throw new Error('CODER_TEMPLATE_ID tanımlı değil. blacknook-dev şablonunu yükleyip ID’yi ayarlayın.');
  }
  return { token, templateId };
}

async function coderFetch<T>(
  path: string,
  init: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token: cfgToken } = requireConfig();
  const token = init.token || cfgToken;
  const url = `${coderBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Coder-Session-Token': token,
        ...(init.headers || {}),
      },
      cache: 'no-store',
    });
  } catch (err) {
    const cause =
      err instanceof Error && 'cause' in err && err.cause instanceof Error
        ? err.cause.message
        : err instanceof Error
          ? err.message
          : 'bağlantı hatası';
    throw new Error(
      `Coder API’ye ulaşılamadı (${coderBaseUrl()}): ${cause}. Compose’ta CODER_INTERNAL_URL=http://coder:7080 olmalı.`
    );
  }

  if (!res.ok) {
    let detail = '';
    try {
      const body = (await res.json()) as { message?: string; detail?: string };
      detail = body.message || body.detail || JSON.stringify(body);
    } catch {
      detail = await res.text().catch(() => '');
    }
    throw new Error(`Coder API ${res.status}: ${detail || res.statusText}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

function mapStatus(ws: CoderApiWorkspace): CoderWorkspaceStatus {
  const top = (ws.status || '').toLowerCase();
  if (
    [
      'pending',
      'starting',
      'running',
      'stopping',
      'stopped',
      'failed',
      'canceling',
      'canceled',
      'deleting',
      'deleted',
    ].includes(top)
  ) {
    return top as CoderWorkspaceStatus;
  }

  const raw = (ws.latest_build?.status || '').toLowerCase();
  const transition = (ws.latest_build?.transition || '').toLowerCase();

  if (raw === 'running') return 'starting';
  if (raw === 'succeeded' && transition === 'start') return 'running';
  if (raw === 'succeeded' && transition === 'stop') return 'stopped';
  if (raw === 'pending') return 'pending';
  if (raw === 'failed') return 'failed';
  if (raw === 'canceling') return 'canceling';
  if (raw === 'canceled') return 'canceled';
  return 'unknown';
}

function toInfo(ws: CoderApiWorkspace): WorkspaceInfo {
  const status = mapStatus(ws);
  const base = publicCoderUrl();
  return {
    id: ws.id,
    name: ws.name,
    status,
    healthy: Boolean(ws.health?.healthy),
    ownerName: ws.owner_name,
    // Coder workspace dashboard; code-server app path şablonda tanımlı
    accessUrl: `${base}/@${encodeURIComponent(ws.owner_name || 'me')}/${encodeURIComponent(ws.name)}`,
    updatedAt: ws.updated_at,
  };
}

/** Workspace adını Coder kurallarına uygun hale getirir */
export function sanitizeWorkspaceName(projectName: string, userId: number | string): string {
  const base = String(projectName || 'app')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 20);
  const suffix = String(userId).replace(/\D/g, '').slice(-6) || '0';
  const name = `${base || 'app'}-${suffix}`.slice(0, 32);
  if (!/^[a-z0-9]/.test(name)) return `w-${name}`.slice(0, 32);
  return name;
}

/**
 * Yeni izole geliştirici konteyneri oluşturur.
 * userId: Blacknook kullanıcı id (isim üretimi için)
 * projectName: proje / workspace adı
 */
export async function createWorkspace(
  userId: number | string,
  projectName: string
): Promise<WorkspaceInfo> {
  const { templateId } = requireConfig();
  const name = sanitizeWorkspaceName(projectName, userId);

  const ws = await coderFetch<CoderApiWorkspace>(`/api/v2/users/me/workspaces`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      template_id: templateId,
      rich_parameter_values: [],
    }),
  });

  return toInfo(ws);
}

/** Çalışma alanının durumunu döner */
export async function getWorkspaceStatus(workspaceId: string): Promise<WorkspaceInfo> {
  if (!workspaceId?.trim()) throw new Error('workspaceId gerekli');
  const ws = await coderFetch<CoderApiWorkspace>(
    `/api/v2/workspaces/${encodeURIComponent(workspaceId)}`
  );
  return toInfo(ws);
}

/** Konteyneri durdurur / kaynakları serbest bırakır */
export async function stopWorkspace(workspaceId: string): Promise<WorkspaceInfo> {
  if (!workspaceId?.trim()) throw new Error('workspaceId gerekli');
  await coderFetch(`/api/v2/workspaces/${encodeURIComponent(workspaceId)}/builds`, {
    method: 'POST',
    body: JSON.stringify({ transition: 'stop' }),
  });
  return getWorkspaceStatus(workspaceId);
}

/** Durmuş workspace’i yeniden başlatır */
export async function startWorkspace(workspaceId: string): Promise<WorkspaceInfo> {
  if (!workspaceId?.trim()) throw new Error('workspaceId gerekli');
  await coderFetch(`/api/v2/workspaces/${encodeURIComponent(workspaceId)}/builds`, {
    method: 'POST',
    body: JSON.stringify({ transition: 'start' }),
  });
  return getWorkspaceStatus(workspaceId);
}

/** Başarısız / eski workspace’i siler (orphan temizliği) */
export async function deleteWorkspace(workspaceId: string): Promise<void> {
  if (!workspaceId?.trim()) throw new Error('workspaceId gerekli');
  await coderFetch(`/api/v2/workspaces/${encodeURIComponent(workspaceId)}?orphan=false`, {
    method: 'DELETE',
  });
}

/** Coder yapılandırması hazır mı? */
export function isCoderConfigured(): boolean {
  return Boolean(process.env.CODER_API_TOKEN?.trim() && process.env.CODER_TEMPLATE_ID?.trim());
}

export function getCoderPublicUrl(): string {
  return publicCoderUrl();
}
