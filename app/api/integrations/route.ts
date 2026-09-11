import { NextRequest, NextResponse } from 'next/server';
import { ensureCriticalSchema } from '@/lib/ensureSchema';
import { getSessionUser } from '@/lib/sessionUser';
import { listCompanyIntegrations } from '@/lib/companyIntegrationsStore';
import { failResponse, logServerError } from '@/lib/errorLog';
import { statusLabel, departmentChipLabel, PROVIDER_META } from '@/lib/companyIntegrations';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await ensureCriticalSchema();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    const integrations = await listCompanyIntegrations(user.id);

    return NextResponse.json({
      integrations: integrations.map((item) => ({
        ...item,
        statusLabel: statusLabel(item.status),
        departmentLabels: item.assignedDepartments.map(departmentChipLabel),
        providerMeta: PROVIDER_META[item.provider],
      })),
    });
  } catch (error) {
    const logId = await logServerError({
      source: 'integrations.GET',
      error,
      req,
    });
    return failResponse('Bağlantılar yüklenemedi.', logId);
  }
}
