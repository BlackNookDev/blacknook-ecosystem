import { NextRequest, NextResponse } from 'next/server';
import { ensureCriticalSchema } from '@/lib/ensureSchema';
import { getSessionUser } from '@/lib/sessionUser';
import { OAUTH_PROVIDERS, type IntegrationProvider } from '@/lib/companyIntegrations';
import {
  disconnectProvider,
  upsertProviderStatus,
} from '@/lib/companyIntegrationsStore';
import { failResponse, logServerError } from '@/lib/errorLog';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await ensureCriticalSchema();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const provider = String(body.provider || '') as IntegrationProvider;
    const action = String(body.action || 'connect');

    if (!OAUTH_PROVIDERS.includes(provider)) {
      return NextResponse.json({ error: 'Geçersiz sağlayıcı.' }, { status: 400 });
    }

    if (action === 'disconnect') {
      const integration = await disconnectProvider(user.id, provider);
      return NextResponse.json({
        ok: true,
        mock: true,
        integration,
        message: 'Erişim izni kaldırıldı.',
      });
    }

    // MVP: gerçek OAuth yerine anında yetkilendirme (mock bağlı durum)
    const integration = await upsertProviderStatus(user.id, provider, 'connected', {
      mock: true,
      authorizedAt: new Date().toISOString(),
      displayAccount: user.email,
    });

    return NextResponse.json({
      ok: true,
      mock: true,
      authorizeUrl: null,
      integration,
      message: 'Yetkilendirme tamamlandı. Aktif bağlantı kuruldu.',
    });
  } catch (error) {
    const logId = await logServerError({
      source: 'integrations.oauth.init',
      error,
      req,
    });
    return failResponse('Yetkilendirme başlatılamadı.', logId);
  }
}
