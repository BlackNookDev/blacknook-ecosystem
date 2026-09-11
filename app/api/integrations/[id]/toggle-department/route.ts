import { NextRequest, NextResponse } from 'next/server';
import { ensureCriticalSchema } from '@/lib/ensureSchema';
import { getSessionUser } from '@/lib/sessionUser';
import { toggleDepartments } from '@/lib/companyIntegrationsStore';
import { DEPARTMENT_LABELS } from '@/lib/companyIntegrations';
import { failResponse, logServerError } from '@/lib/errorLog';

export const dynamic = 'force-dynamic';

type Ctx = { params: { id: string } };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    await ensureCriticalSchema();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const assigned = Array.isArray(body.assignedDepartments)
      ? body.assignedDepartments.map((s: unknown) => String(s).trim()).filter(Boolean)
      : [];

    const allowed = new Set(Object.keys(DEPARTMENT_LABELS));
    const filtered = assigned.filter((slug: string) => allowed.has(slug));

    const integration = await toggleDepartments(user.id, params.id, filtered);
    if (!integration) {
      return NextResponse.json({ error: 'Bağlantı bulunamadı.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, integration });
  } catch (error) {
    const logId = await logServerError({
      source: 'integrations.toggle-department',
      error,
      req,
    });
    return failResponse('Departman erişimi güncellenemedi.', logId);
  }
}
