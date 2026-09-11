import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/sessionUser';
import { getPlatformMailTo, sendPlatformEmail, sendUserEmail } from '@/lib/mail';
import { failResponse, logServerError } from '@/lib/errorLog';

export const dynamic = 'force-dynamic';

/**
 * Ana sayfa arama — “Aradığınızı bulamadınız mı?” geri bildirimi.
 * Kurulum kuyruğuna yazmaz; ekibe e-posta ile iletir.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    const body = await req.json().catch(() => ({}));

    const need = typeof body.need === 'string' ? body.need.trim() : '';
    const sector = typeof body.sector === 'string' ? body.sector.trim() : '';
    const company =
      typeof body.companyName === 'string' ? body.companyName.trim() : '';
    const searchQuery =
      typeof body.searchQuery === 'string' ? body.searchQuery.trim() : '';
    const fromEmail =
      user?.email ||
      (typeof body.email === 'string' ? body.email.trim().toLowerCase() : '');
    const name =
      user?.name ||
      (typeof body.name === 'string' ? body.name.trim() : '') ||
      (fromEmail ? fromEmail.split('@')[0] : '');

    if (!need || need.length < 8) {
      return NextResponse.json(
        { error: 'Aradığınız çözümü en az birkaç cümleyle tarif edin.' },
        { status: 400 }
      );
    }
    if (!sector) {
      return NextResponse.json({ error: 'Sektör bilgisi gerekli.' }, { status: 400 });
    }
    if (!company) {
      return NextResponse.json({ error: 'Şirket bilgisi gerekli.' }, { status: 400 });
    }
    if (!fromEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
      return NextResponse.json({ error: 'Geçerli e-posta gerekli.' }, { status: 400 });
    }
    if (need.length > 4000) {
      return NextResponse.json({ error: 'Tarif metni çok uzun.' }, { status: 400 });
    }

    const subject = `[Blacknook Arama Talebi] ${company} · ${sector}`;
    const text = [
      `Gönderen: ${name} <${fromEmail}>`,
      `Şirket: ${company}`,
      `Sektör: ${sector}`,
      searchQuery ? `Orijinal arama: ${searchQuery}` : '',
      user?.id ? `Kullanıcı id: ${user.id}` : 'Misafir',
      '',
      'Aranan çözüm:',
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
      console.error('[search-feedback] SMTP:', teamResult.error);
      return NextResponse.json(
        { error: 'Talep gönderilemedi. Lütfen contact@blacknook.com yazın.' },
        { status: 502 }
      );
    }

    await sendUserEmail({
      to: fromEmail,
      subject: 'Blacknook — talebiniz alındı',
      text: `Merhaba${name ? ` ${name}` : ''},\n\nArama talebiniz ekibimize iletildi. Uygun çözümü birlikte netleştirmek için en kısa sürede dönüş yapacağız.\n\n— Blacknook`,
      html: `<p>Merhaba${name ? ` ${name}` : ''},</p><p>Arama talebiniz ekibimize iletildi. Uygun çözümü birlikte netleştirmek için en kısa sürede dönüş yapacağız.</p><p>— Blacknook</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const logId = await logServerError({
      source: 'search-feedback.POST',
      error,
      req,
    });
    return failResponse('Talep gönderilemedi.', logId);
  }
}
