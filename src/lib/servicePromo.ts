/** Deterministik seed */
export function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

export function accentFromBrand(brandColor: string): {
  bg: string;
  glow: string;
  soft: string;
} {
  const hex = brandColor.replace('#', '');
  const full =
    hex.length === 3
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex.padEnd(6, '0').slice(0, 6);
  const n = Number.parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return {
    bg: brandColor,
    glow: `rgba(${r},${g},${b},0.5)`,
    soft: `rgba(${r},${g},${b},0.22)`,
  };
}

export type PromoTheme =
  | 'deploy'
  | 'payments'
  | 'cms'
  | 'backend'
  | 'database'
  | 'ai'
  | 'comms'
  | 'charts'
  | 'containers'
  | 'proxy'
  | 'security'
  | 'observability'
  | 'docs'
  | 'search'
  | 'analytics'
  | 'automation'
  | 'queue'
  | 'devops'
  | 'devtools'
  | 'email'
  | 'calendar'
  | 'education'
  | 'generic';

const SLUG_THEME: Record<string, PromoTheme> = {
  'nook-muhasebe-mcp': 'automation',
  plausible: 'analytics',
  metabase: 'charts',
  'cal-com': 'calendar',
  outline: 'docs',
  chatwoot: 'comms',
};

const THEME_IMAGE: Record<PromoTheme, string> = {
  deploy: '/service-promo/deploy.jpg',
  payments: '/service-promo/payments.jpg',
  cms: '/service-promo/cms.jpg',
  backend: '/service-promo/backend.jpg',
  database: '/service-promo/database.jpg',
  ai: '/service-promo/ai.jpg',
  comms: '/service-promo/comms.jpg',
  charts: '/service-promo/analytics.jpg',
  containers: '/service-promo/infra.jpg',
  proxy: '/service-promo/infra.jpg',
  security: '/service-promo/security.jpg',
  observability: '/service-promo/observability.jpg',
  docs: '/service-promo/docs.jpg',
  search: '/service-promo/search.jpg',
  analytics: '/service-promo/analytics.jpg',
  automation: '/service-promo/automation.jpg',
  queue: '/service-promo/automation.jpg',
  devops: '/service-promo/devops.jpg',
  devtools: '/service-promo/backend.jpg',
  email: '/service-promo/email.jpg',
  calendar: '/service-promo/calendar.jpg',
  education: '/service-promo/education.jpg',
  generic: '/service-promo/deploy.jpg',
};

export function promoThemeFor(slug: string, category: string): PromoTheme {
  const s = slug.toLowerCase();
  if (SLUG_THEME[s]) return SLUG_THEME[s];
  for (const [key, theme] of Object.entries(SLUG_THEME)) {
    if (s.includes(key)) return theme;
  }
  const c = category.toLowerCase();
  if (c.includes('planlama') || c.includes('randevu')) return 'calendar';
  if (c.includes('analitik')) return 'analytics';
  if (c.includes('görselleştir') || c.includes('bi')) return 'charts';
  if (c.includes('iletişim') || c.includes('destek')) return 'comms';
  if (c.includes('dokümantasyon') || c.includes('wiki')) return 'docs';
  if (c.includes('otomasyon') || c.includes('iş akışı')) return 'automation';
  return 'generic';
}

export function promoImageFor(slug: string, category: string): string {
  return THEME_IMAGE[promoThemeFor(slug, category)];
}
