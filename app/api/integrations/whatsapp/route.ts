import { NextRequest, NextResponse } from 'next/server';
import { ensureCriticalSchema } from '@/lib/ensureSchema';
import { getSessionUser } from '@/lib/sessionUser';
import {
  confirmWhatsappPairing,
  refreshWhatsappPairing,
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
    const action = String(body.action || 'refresh');

    if (action === 'confirm') {
      const integration = await confirmWhatsappPairing(user.id);
      return NextResponse.json({
        ok: true,
        mock: true,
        integration,
        message:
          'Saha WhatsApp hattı dinleniyor; gelen masraf ve fişler Muhasebe Ajanı’na yönlendirilecek.',
      });
    }

    const integration = await refreshWhatsappPairing(user.id);
    return NextResponse.json({
      ok: true,
      mock: true,
      integration,
      message: 'Yeni eşleşme kodu hazır.',
    });
  } catch (error) {
    const logId = await logServerError({
      source: 'integrations.whatsapp',
      error,
      req,
    });
    return failResponse('WhatsApp eşleştirmesi güncellenemedi.', logId);
  }
}
