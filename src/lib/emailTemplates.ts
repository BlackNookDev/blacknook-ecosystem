import { escapeHtml } from './mail';
import { getAppBaseUrl } from './passwordReset';

/**
 * Blacknook branded e-posta şablonları.
 * Site token’ları (--bn-*) ile uyumlu; e-posta istemcileri için inline CSS + tablo layout.
 */

const C = {
  bg: '#161618',
  bgDeep: '#121214',
  surface: '#1c1c1f',
  elevated: '#242428',
  panel: '#1a1a1d',
  border: 'rgba(255,255,255,0.09)',
  borderStrong: 'rgba(255,255,255,0.16)',
  text: '#f4f4f5',
  muted: '#a1a1aa',
  faint: '#71717a',
  accent: '#fafafa',
  ink: '#09090b',
  glow: 'rgba(255,255,255,0.10)',
} as const;

const FONT_DISPLAY =
  "'Syne',Arial,Helvetica,sans-serif";
const FONT_BODY =
  "'Source Sans 3','Segoe UI',Arial,Helvetica,sans-serif";

function siteUrl(path = '/') {
  const base = getAppBaseUrl();
  if (path.startsWith('http')) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function markUrl() {
  return siteUrl('/bn-mark.png');
}

function ctaButton(href: string, label: string) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0 4px;">
      <tr>
        <td align="left">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="border-radius:999px;background:${C.accent};">
                <a href="${escapeHtml(href)}"
                   style="display:inline-block;padding:13px 26px;font-family:${FONT_BODY};font-size:13px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${C.ink};text-decoration:none;border-radius:999px;">
                  ${escapeHtml(label)}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
}

function detailCard(rows: { label: string; valueHtml: string }[]) {
  const body = rows
    .map(
      (row, i) => `
    <tr>
      <td style="padding:${i === 0 ? '0' : '14px'} 0 ${i === rows.length - 1 ? '0' : '14px'};${
        i === rows.length - 1 ? '' : `border-bottom:1px solid ${C.border};`
      }">
        <p style="margin:0 0 6px;font-family:${FONT_BODY};font-size:10px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${C.faint};">
          ${escapeHtml(row.label)}
        </p>
        <div style="font-family:${FONT_BODY};font-size:15px;line-height:1.5;color:${C.text};">
          ${row.valueHtml}
        </div>
      </td>
    </tr>`
    )
    .join('');

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 8px;background:${C.elevated};border:1px solid ${C.border};border-radius:14px;">
      <tr>
        <td style="padding:18px 20px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            ${body}
          </table>
        </td>
      </tr>
    </table>`;
}

function quoteBlock(label: string, contentHtml: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 6px;">
      <tr>
        <td style="padding:0 0 0 14px;border-left:2px solid ${C.borderStrong};">
          <p style="margin:0 0 8px;font-family:${FONT_BODY};font-size:10px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${C.faint};">
            ${escapeHtml(label)}
          </p>
          <div style="font-family:${FONT_BODY};font-size:15px;line-height:1.65;color:${C.muted};">
            ${contentHtml}
          </div>
        </td>
      </tr>
    </table>`;
}

export type BrandEmailPayload = {
  preheader?: string;
  eyebrow?: string;
  title: string;
  bodyHtml: string;
  cta?: { href: string; label: string };
  footerNote?: string;
};

/** Ortak Blacknook HTML zarfı */
export function renderBrandEmail(payload: BrandEmailPayload): string {
  const home = siteUrl('/');
  const mark = markUrl();
  const year = new Date().getFullYear();

  const preheader = payload.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${escapeHtml(payload.preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>`
    : '';

  const eyebrow = payload.eyebrow
    ? `<p style="margin:0 0 14px;font-family:${FONT_BODY};font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:${C.faint};">${escapeHtml(payload.eyebrow)}</p>`
    : '';

  const cta = payload.cta ? ctaButton(payload.cta.href, payload.cta.label) : '';

  const footerNote = payload.footerNote
    ? `<p style="margin:0 0 12px;font-family:${FONT_BODY};font-size:12px;line-height:1.55;color:${C.faint};">${escapeHtml(payload.footerNote)}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="tr" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <meta name="theme-color" content="${C.bg}" />
  <title>${escapeHtml(payload.title)}</title>
  <!--[if !mso]><!-->
  <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
  <!--<![endif]-->
  <style>
    :root { color-scheme: dark; supported-color-schemes: dark; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    a { color: ${C.accent}; }
    @media (max-width: 620px) {
      .bn-shell { padding: 24px 12px !important; }
      .bn-card { border-radius: 16px !important; }
      .bn-pad { padding: 28px 22px !important; }
      .bn-pad-sm { padding: 20px 22px !important; }
      .bn-title { font-size: 22px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${C.bgDeep};">
  ${preheader}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bgDeep};">
    <tr>
      <td align="center" class="bn-shell" style="padding:48px 16px;">
        <!-- Atmosphere wash -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
          <tr>
            <td align="center" style="padding:0 0 22px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:0 10px 0 0;vertical-align:middle;">
                    <a href="${escapeHtml(home)}" style="text-decoration:none;">
                      <img src="${escapeHtml(mark)}" width="28" height="28" alt="Blacknook" style="display:block;width:28px;height:28px;border:0;filter:brightness(0) invert(1);" />
                    </a>
                  </td>
                  <td style="vertical-align:middle;">
                    <a href="${escapeHtml(home)}" style="font-family:${FONT_DISPLAY};font-size:16px;font-weight:700;letter-spacing:-0.02em;color:${C.text};text-decoration:none;">
                      Blacknook
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="bn-card" style="background:${C.surface};border:1px solid ${C.border};border-radius:20px;overflow:hidden;">
              <!-- Soft top highlight -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="height:3px;line-height:3px;font-size:0;background:linear-gradient(90deg,rgba(255,255,255,0.28) 0%,rgba(255,255,255,0.06) 45%,rgba(255,255,255,0.02) 100%);">&nbsp;</td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="bn-pad" style="padding:36px 36px 28px;background:radial-gradient(ellipse 90% 70% at 50% -20%, ${C.glow} 0%, transparent 55%), ${C.surface};">
                    ${eyebrow}
                    <h1 class="bn-title" style="margin:0 0 18px;font-family:${FONT_DISPLAY};font-size:26px;line-height:1.2;font-weight:800;letter-spacing:-0.035em;color:${C.text};">
                      ${escapeHtml(payload.title)}
                    </h1>
                    <div style="font-family:${FONT_BODY};font-size:15px;line-height:1.7;color:${C.muted};">
                      ${payload.bodyHtml}
                    </div>
                    ${cta}
                  </td>
                </tr>
                <tr>
                  <td class="bn-pad-sm" style="padding:22px 36px 28px;border-top:1px solid ${C.border};background:${C.panel};">
                    ${footerNote}
                    <p style="margin:0;font-family:${FONT_BODY};font-size:12px;line-height:1.5;color:${C.faint};">
                      © ${year} Blacknook
                      <span style="color:${C.borderStrong};padding:0 8px;">·</span>
                      <a href="${escapeHtml(home)}" style="color:${C.muted};text-decoration:none;">blacknook.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:22px 8px 0;">
              <p style="margin:0;font-family:${FONT_BODY};font-size:11px;line-height:1.5;color:${C.faint};">
                Keşif · yönetilen kurulum · otonom panel
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function p(text: string) {
  return `<p style="margin:0 0 14px;font-family:${FONT_BODY};font-size:15px;line-height:1.7;color:${C.muted};">${text}</p>`;
}

function strong(text: string) {
  return `<strong style="color:${C.text};font-weight:600;">${text}</strong>`;
}

export function welcomeRegisterEmail(params: { name: string; email: string }) {
  const name = params.name.trim() || 'merhaba';
  const services = siteUrl('/services');
  const html = renderBrandEmail({
    preheader: 'Blacknook hesabınız hazır. Kataloğu keşfedin.',
    eyebrow: 'Hoş geldiniz',
    title: `Merhaba ${name}`,
    bodyHtml: [
      p(
        'Hesabınız hazır. Ajan kataloğunu gezebilir, Kurulum Talep Et ile onboarding başlatabilir ve /agent panelini kullanabilirsiniz.'
      ),
      detailCard([
        { label: 'Hesap', valueHtml: strong(escapeHtml(params.email)) },
      ]),
    ].join(''),
    cta: { href: services, label: 'Ekosistemi keşfet' },
    footerNote: 'Bu e-postayı kayıt olduğunuz için aldınız.',
  });

  return {
    subject: 'Blacknook’a hoş geldiniz',
    text: [
      `Merhaba ${name},`,
      '',
      'Hesabınız başarıyla oluşturuldu.',
      `Kayıtlı e-posta: ${params.email}`,
      '',
      `Ekosistemi keşfet: ${services}`,
    ].join('\n'),
    html,
  };
}

export function waitlistConfirmEmail(params: { email: string }) {
  const home = siteUrl('/');
  const html = renderBrandEmail({
    preheader: 'Early access listesine eklendiniz.',
    eyebrow: 'Early access',
    title: 'Listenize eklendiniz',
    bodyHtml: [
      p(
        'Blacknook erken erişim listesine kaydınız alındı. Lansman ve önemli güncellemelerde sizi bilgilendireceğiz.'
      ),
      detailCard([
        { label: 'E-posta', valueHtml: strong(escapeHtml(params.email)) },
      ]),
    ].join(''),
    cta: { href: home, label: 'Ana sayfaya dön' },
    footerNote: 'İstemediyseniz bu e-postayı yok sayabilirsiniz.',
  });

  return {
    subject: 'Blacknook waitlist kaydınız alındı',
    text: [
      'Blacknook erken erişim listesine kaydınız alındı.',
      `E-posta: ${params.email}`,
      home,
    ].join('\n'),
    html,
  };
}

export function waitlistTeamEmail(params: { email: string }) {
  const html = renderBrandEmail({
    preheader: `Yeni waitlist: ${params.email}`,
    eyebrow: 'Ekip',
    title: 'Yeni waitlist kaydı',
    bodyHtml: detailCard([
      { label: 'E-posta', valueHtml: strong(escapeHtml(params.email)) },
      { label: 'Kaynak', valueHtml: 'Ana sayfa hero formu' },
    ]),
  });

  return {
    subject: `Waitlist: ${params.email}`,
    text: `Yeni waitlist kaydı: ${params.email}\nKaynak: Ana sayfa hero formu`,
    html,
  };
}

export function passwordResetEmail(params: { name?: string | null; resetUrl: string }) {
  const greeting = params.name?.trim() ? `Merhaba ${params.name.trim()}` : 'Merhaba';
  const html = renderBrandEmail({
    preheader: 'Şifre sıfırlama bağlantınız (1 saat geçerli).',
    eyebrow: 'Güvenlik',
    title: 'Şifrenizi sıfırlayın',
    bodyHtml: [
      p(`${escapeHtml(greeting)},`),
      p(
        `Şifrenizi sıfırlamak için aşağıdaki düğmeyi kullanın. Bağlantı ${strong('1 saat')} geçerlidir.`
      ),
      p(
        `Bağlantı çalışmazsa bu adresi tarayıcıya yapıştırın:<br /><a href="${escapeHtml(params.resetUrl)}" style="color:${C.accent};word-break:break-all;text-decoration:underline;text-underline-offset:3px;">${escapeHtml(params.resetUrl)}</a>`
      ),
    ].join(''),
    cta: { href: params.resetUrl, label: 'Şifremi sıfırla' },
    footerNote: 'Bu isteği siz yapmadıysanız e-postayı yok sayın.',
  });

  return {
    subject: 'Blacknook şifre sıfırlama',
    text: [
      greeting + ',',
      '',
      'Şifrenizi sıfırlamak için (1 saat geçerli):',
      params.resetUrl,
      '',
      'İstek sizden gelmediyse yok sayın.',
    ].join('\n'),
    html,
  };
}

export function passwordChangedEmail(params: { name?: string | null }) {
  const greeting = params.name?.trim() ? `Merhaba ${params.name.trim()}` : 'Merhaba';
  const login = siteUrl('/login');
  const html = renderBrandEmail({
    preheader: 'Şifreniz güncellendi.',
    eyebrow: 'Güvenlik',
    title: 'Şifreniz değiştirildi',
    bodyHtml: [
      p(`${escapeHtml(greeting)},`),
      p(
        'Blacknook hesabınızın şifresi başarıyla güncellendi. Bu işlemi siz yapmadıysanız hemen bizimle iletişime geçin.'
      ),
    ].join(''),
    cta: { href: login, label: 'Giriş yap' },
  });

  return {
    subject: 'Blacknook şifreniz güncellendi',
    text: [
      greeting + ',',
      '',
      'Hesap şifreniz güncellendi.',
      `Giriş: ${login}`,
    ].join('\n'),
    html,
  };
}

export function installationUserEmail(params: {
  serviceName: string;
  serviceSlug: string;
  companyName: string;
  requirements: string;
  deploymentLabel?: string;
}) {
  const detail = siteUrl(`/service/${params.serviceSlug}`);
  const html = renderBrandEmail({
    preheader: `${params.serviceName} kurulum talebiniz alındı.`,
    eyebrow: 'Kurulum',
    title: 'Talebiniz alındı',
    bodyHtml: [
      p(
        'Kurulum talebinizi aldık. Blacknook operasyon ekibi yönetilen kurulum sürecini başlatacak ve en kısa sürede sizinle iletişime geçecek.'
      ),
      detailCard([
        { label: 'Servis', valueHtml: strong(escapeHtml(params.serviceName)) },
        { label: 'Şirket', valueHtml: escapeHtml(params.companyName) },
        ...(params.deploymentLabel
          ? [{ label: 'Kurulum ortamı', valueHtml: escapeHtml(params.deploymentLabel) }]
          : []),
      ]),
      quoteBlock(
        'Talebiniz',
        escapeHtml(params.requirements).replace(/\n/g, '<br />')
      ),
    ].join(''),
    cta: { href: detail, label: 'Servis sayfasına dön' },
  });

  return {
    subject: `Kurulum talebiniz alındı — ${params.serviceName}`,
    text: [
      `Kurulum talebiniz alındı: ${params.serviceName}`,
      `Şirket: ${params.companyName}`,
      params.deploymentLabel ? `Kurulum ortamı: ${params.deploymentLabel}` : '',
      '',
      params.requirements,
      '',
      detail,
    ]
      .filter(Boolean)
      .join('\n'),
    html,
  };
}

export function installationTeamEmail(params: {
  serviceName: string;
  serviceSlug: string;
  companyName: string;
  email: string;
  requirements: string;
  deploymentLabel?: string;
  adminHref?: string;
}) {
  const adminUrl = params.adminHref
    ? siteUrl(params.adminHref)
    : siteUrl('/admin/installations');
  const html = renderBrandEmail({
    preheader: `Kurulum: ${params.serviceName}`,
    eyebrow: 'Operasyon',
    title: 'Yeni kurulum talebi',
    bodyHtml: [
      detailCard([
        {
          label: 'Servis',
          valueHtml: `${strong(escapeHtml(params.serviceName))} <span style="color:${C.faint};">(${escapeHtml(params.serviceSlug)})</span>`,
        },
        { label: 'Şirket', valueHtml: escapeHtml(params.companyName) },
        { label: 'E-posta', valueHtml: escapeHtml(params.email) },
        ...(params.deploymentLabel
          ? [{ label: 'Kurulum ortamı', valueHtml: escapeHtml(params.deploymentLabel) }]
          : []),
      ]),
      quoteBlock(
        'Detay',
        escapeHtml(params.requirements).replace(/\n/g, '<br />')
      ),
      p(
        `<a href="${escapeHtml(adminUrl)}" style="color:${C.accent};">Admin kurulum paneline git →</a>`
      ),
    ].join(''),
  });

  return {
    subject: `Kurulum talebi: ${params.serviceName}`,
    text: [
      `Servis: ${params.serviceName} (${params.serviceSlug})`,
      `Şirket: ${params.companyName}`,
      `E-posta: ${params.email}`,
      params.deploymentLabel ? `Kurulum ortamı: ${params.deploymentLabel}` : '',
      '',
      params.requirements,
      '',
      `Admin: ${adminUrl}`,
    ]
      .filter(Boolean)
      .join('\n'),
    html,
  };
}

export function matchUserEmail(params: {
  name: string;
  need: string;
  requestId?: number;
  assigneeName?: string;
  conversationId?: number | null;
}) {
  const href = params.conversationId
    ? siteUrl(`/account/messages?c=${params.conversationId}`)
    : siteUrl('/account/requests');
  const matched = Boolean(params.assigneeName);
  const generic = params.assigneeName === 'Bir geliştirici';
  const html = renderBrandEmail({
    preheader: matched
      ? generic
        ? 'Teknik ekibinizle bağlandınız.'
        : `${params.assigneeName} ile bağlandınız.`
      : 'Destek talebiniz alındı.',
    eyebrow: 'Destek',
    title: matched ? 'Teknik ekibe bağlandınız' : 'Talebiniz kaydedildi',
    bodyHtml: [
      p(
        matched
          ? generic
            ? `Merhaba ${escapeHtml(params.name)}, talebiniz teknik ekibe iletildi. Sohbete siteden devam edebilirsiniz.`
            : `Merhaba ${escapeHtml(params.name)}, talebiniz ${strong(params.assigneeName || '')} ile bağlandı. Sohbete siteden devam edebilirsiniz.`
          : `Merhaba ${escapeHtml(params.name)}, destek talebinizi aldık. Uygun bir uzman bulunduğunda sizinle iletişime geçeceğiz.`
      ),
      params.requestId != null
        ? detailCard([
            {
              label: 'Talep no',
              valueHtml: strong(`#${params.requestId}`),
            },
          ])
        : '',
      quoteBlock('İhtiyacınız', escapeHtml(params.need).replace(/\n/g, '<br />')),
    ].join(''),
    cta: { href, label: matched ? 'Mesaja git' : 'Taleplerimi gör' },
  });

  return {
    subject: matched
      ? generic
        ? 'Teknik ekibe bağlandınız — Blacknook'
        : `${params.assigneeName} ile bağlandınız — Blacknook`
      : 'Destek talebiniz alındı — Blacknook',
    text: [
      `Merhaba ${params.name},`,
      '',
      matched
        ? generic
          ? 'Talebiniz teknik ekibe iletildi.'
          : `Talebiniz ${params.assigneeName} ile bağlandı.`
        : 'Destek talebiniz alındı.',
      params.requestId != null ? `Talep #${params.requestId}` : '',
      '',
      params.need,
      '',
      href,
    ]
      .filter(Boolean)
      .join('\n'),
    html,
  };
}

export function matchTeamEmail(params: {
  name: string;
  email: string;
  need: string;
  requestId?: number;
  assigneeName?: string;
}) {
  const html = renderBrandEmail({
    preheader: `Destek: ${params.name}`,
    eyebrow: 'Ekip',
    title: 'Yeni destek talebi',
    bodyHtml: [
      detailCard([
        { label: 'Kullanıcı', valueHtml: strong(escapeHtml(params.name)) },
        {
          label: 'E-posta',
          valueHtml: escapeHtml(params.email || '(belirtilmedi)'),
        },
        {
          label: 'Talep ID',
          valueHtml: escapeHtml(String(params.requestId ?? '-')),
        },
        {
          label: 'Atanan',
          valueHtml: escapeHtml(params.assigneeName || 'Havuz boş — ekip'),
        },
      ]),
      quoteBlock('İhtiyaç', escapeHtml(params.need).replace(/\n/g, '<br />')),
    ].join(''),
  });

  return {
    subject: `Destek talebi: ${params.name}`,
    text: [
      `Kullanıcı: ${params.name}`,
      `E-posta: ${params.email || '(belirtilmedi)'}`,
      `Talep ID: ${params.requestId ?? '-'}`,
      `Atanan: ${params.assigneeName || 'Havuz boş — ekip'}`,
      '',
      params.need,
    ].join('\n'),
    html,
  };
}

export function matchAssigneeEmail(params: {
  assigneeName: string;
  requesterName: string;
  need: string;
  conversationId?: number | null;
}) {
  const href = params.conversationId
    ? siteUrl(`/account/messages?c=${params.conversationId}`)
    : siteUrl('/account/messages');
  const html = renderBrandEmail({
    preheader: `${params.requesterName} destek talebi açtı.`,
    eyebrow: 'Destek',
    title: 'Yeni destek talebi',
    bodyHtml: [
      p(
        `Merhaba ${escapeHtml(params.assigneeName)}, ${strong(params.requesterName)} sizinle bağlandı.`
      ),
      quoteBlock('İhtiyaç', escapeHtml(params.need).replace(/\n/g, '<br />')),
    ].join(''),
    cta: { href, label: 'Mesaja git' },
  });

  return {
    subject: `${params.requesterName} — yeni destek talebi — Blacknook`,
    text: [
      `Merhaba ${params.assigneeName},`,
      '',
      `${params.requesterName} sizinle bağlandı.`,
      '',
      params.need,
      '',
      href,
    ].join('\n'),
    html,
  };
}

export function messageReceivedEmail(params: {
  toName: string;
  fromName: string;
  preview: string;
  conversationId: number;
}) {
  const href = siteUrl(`/account/messages?c=${params.conversationId}`);
  const preview =
    params.preview.length > 280 ? `${params.preview.slice(0, 277)}…` : params.preview;
  const html = renderBrandEmail({
    preheader: `${params.fromName}: ${preview.slice(0, 80)}`,
    eyebrow: 'Mesaj',
    title: 'Yeni mesaj',
    bodyHtml: [
      p(`Merhaba ${escapeHtml(params.toName)}, ${strong(params.fromName)} size yazdı.`),
      quoteBlock('Mesaj', escapeHtml(preview).replace(/\n/g, '<br />')),
    ].join(''),
    cta: { href, label: 'Yanıtla' },
  });

  return {
    subject: `${params.fromName} size yazdı — Blacknook`,
    text: [
      `Merhaba ${params.toName},`,
      '',
      `${params.fromName} size yazdı:`,
      preview,
      '',
      href,
    ].join('\n'),
    html,
  };
}
