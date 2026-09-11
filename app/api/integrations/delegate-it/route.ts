import { NextRequest, NextResponse } from 'next/server';
import { ensureCriticalSchema } from '@/lib/ensureSchema';
import { getSessionUser } from '@/lib/sessionUser';
import { createItDelegation } from '@/lib/companyIntegrationsStore';
import { failResponse, logServerError } from '@/lib/errorLog';
import { sendPlatformEmail, sendUserEmail } from '@/lib/mail';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await ensureCriticalSchema();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const itName = String(body.itName || '').trim();
    const itEmail = String(body.itEmail || '').trim().toLowerCase();
    const systems = Array.isArray(body.systems)
      ? body.systems.map((s: unknown) => String(s).trim()).filter(Boolean)
      : String(body.systemsText || '')
          .split(/[,;\n]/)
          .map((s: string) => s.trim())
          .filter(Boolean);

    if (!itName || !itEmail || !systems.length) {
      return NextResponse.json(
        { error: 'IT sorumlusu adı, e-posta ve yetkilendirilecek sistemler gerekli.' },
        { status: 400 }
      );
    }

    const { integration, inviteUrl } = await createItDelegation(user.id, {
      itName,
      itEmail,
      systems,
    });

    const subject = 'Blacknook — Kurulum sihirbazı daveti';
    const text = `${itName}, ${user.name || user.email} sizi Blacknook kurulumuna davet etti. Sistemler: ${systems.join(', ')}. Link: ${inviteUrl}`;
    const html = `
      <p>Merhaba ${itName},</p>
      <p>${user.name || user.email} sizi Blacknook şirket bağlantı kurulumuna davet etti.</p>
      <p><strong>Yetkilendirilecek sistemler:</strong> ${systems.join(', ')}</p>
      <p><a href="${inviteUrl}">Kurulum sihirbazını aç</a></p>
      <p>Bu bağlantı 72 saat geçerlidir.</p>
    `;

    try {
      await sendUserEmail({ to: itEmail, subject, text, html });
    } catch {
      /* SMTP yoksa mock devam */
    }

    try {
      await sendPlatformEmail({
        to: process.env.INSTALLATION_REQUEST_TO || 'dev@blacknook.com',
        subject: `[IT delege] ${user.email} → ${itEmail}`,
        text,
        html,
      });
    } catch {
      /* ignore */
    }

    return NextResponse.json({
      ok: true,
      mock: true,
      integration,
      inviteUrl,
      message: 'Kurulum sihirbazı IT sorumlusuna gönderildi. Durum: IT Onayı Bekleniyor.',
    });
  } catch (error) {
    const logId = await logServerError({
      source: 'integrations.delegate-it',
      error,
      req,
    });
    return failResponse('Davet gönderilemedi.', logId);
  }
}
