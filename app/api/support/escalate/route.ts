import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/sessionUser';
import { getPlatformMailTo, sendPlatformEmail, sendUserEmail } from '@/lib/mail';
import { failResponse, logServerError } from '@/lib/errorLog';

export const dynamic = 'force-dynamic';

/**
 * Destek escalate — yalnızca e-posta (+ opsiyonel admin bildirimi).
 * Kurulum kuyruğuna (installation_requests) yazmaz.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    const body = await req.json().catch(() => ({}));
    const need = typeof body.need === 'string' ? body.need.trim() : '';
    const company =
      typeof body.companyName === 'string' ? body.companyName.trim() : '';
    const fromEmail =
      user?.email ||
      (typeof body.email === 'string' ? body.email.trim().toLowerCase() : '');
    const name =
      user?.name ||
      (typeof body.name === 'string' ? body.name.trim() : '') ||
      fromEmail.split('@')[0];

    if (!need || need.length < 8) {
      return NextResponse.json({ error: 'Talep metni gerekli.' }, { status: 400 });
    }
    if (!fromEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
      return NextResponse.json({ error: 'Geçerli e-posta gerekli.' }, { status: 400 });
    }
    if (need.length > 4000) {
      return NextResponse.json({ error: 'Talep metni çok uzun.' }, { status: 400 });
    }

    const subject = `[Blacknook Destek] ${company || name || fromEmail}`;
    const text = [
      `Gönderen: ${name} <${fromEmail}>`,
      company ? `Şirket: ${company}` : '',
      user?.id ? `Kullanıcı id: ${user.id}` : 'Misafir',
      '',
      need,
    ]
      .filter(Boolean)
      .join('\n');

    const teamResult = await sendPlatformEmail({
      to: getPlatformMailTo(),
      replyTo: fromEmail,
      subject,
      text,
      html: `<pre style="font-family:ui-sans-serif,system-ui,sans-serif;white-space:pre-wrap">${text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')}</pre>`,
    });

    if (!teamResult.ok) {
      console.error('[support/escalate] SMTP:', teamResult.error);
      return NextResponse.json(
        { error: 'E-posta gönderilemedi. Lütfen contact@blacknook.com yazın.' },
        { status: 502 }
      );
    }

    await sendUserEmail({
      to: fromEmail,
      subject: 'Blacknook — destek talebiniz alındı',
      text: `Merhaba${name ? ` ${name}` : ''},\n\nDestek talebiniz ekibimize e-posta olarak iletildi. En kısa sürede dönüş yapacağız.\n\n— Blacknook`,
      html: `<p>Merhaba${name ? ` ${name}` : ''},</p><p>Destek talebiniz ekibimize e-posta olarak iletildi. En kısa sürede dönüş yapacağız.</p><p>— Blacknook</p>`,
    });

    return NextResponse.json({ ok: true, channel: 'email' });
  } catch (error) {
    const logId = await logServerError({
      source: 'support/escalate.POST',
      error,
      req,
    });
    return failResponse('Destek talebi gönderilemedi.', logId);
  }
}
