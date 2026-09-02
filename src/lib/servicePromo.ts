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

/** Konu — arkaplan görseli seçimi */
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
  coolify: 'deploy',
  dokku: 'deploy',
  dokploy: 'deploy',
  caprover: 'deploy',
  btcpay: 'payments',
  medusa: 'payments',
  krayin: 'payments',
  ghost: 'cms',
  wordpress: 'cms',
  strapi: 'cms',
  directus: 'cms',
  appwrite: 'backend',
  supabase: 'backend',
  pocketbase: 'backend',
  hasura: 'backend',
  n8n: 'automation',
  'nook-muhasebe-mcp': 'automation',
  activepieces: 'automation',
  flowise: 'automation',
  typebot: 'automation',
  freecodecamp: 'education',
  outline: 'docs',
  notion: 'docs',
  bookstack: 'docs',
  meilisearch: 'search',
  typesense: 'search',
  elasticsearch: 'search',
  grafana: 'charts',
  metabase: 'charts',
  superset: 'charts',
  lightdash: 'charts',
  redash: 'charts',
  plausible: 'analytics',
  umami: 'analytics',
  posthog: 'analytics',
  portainer: 'containers',
  traefik: 'proxy',
  'nginx-proxy-manager': 'proxy',
  keycloak: 'security',
  vaultwarden: 'security',
  authentik: 'security',
  strix: 'security',
  sentry: 'observability',
  'uptime-kuma': 'observability',
  prometheus: 'observability',
  rabbitmq: 'queue',
  kafka: 'queue',
  redis: 'database',
  postgresql: 'database',
  mongodb: 'database',
  mysql: 'database',
  clickhouse: 'database',
  minio: 'database',
  gitea: 'devops',
  gitlab: 'devops',
  hoppscotch: 'devtools',
  appsmith: 'devtools',
  listmonk: 'email',
  mailcow: 'email',
  'cal-com': 'calendar',
  ollama: 'ai',
  openwebui: 'ai',
  langfuse: 'ai',
  dify: 'ai',
  jan: 'ai',
  'anything-llm': 'ai',
  stagehand: 'ai',
  mastra: 'ai',
  chatwoot: 'comms',
  mattermost: 'comms',
  rocketchat: 'comms',
  corteza: 'comms',
};

/** Tema → public/service-promo görseli */
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
  if (c.includes('platform') || c.includes('dağıtım')) return 'deploy';
  if (c.includes('e-ticaret') || c.includes('ödeme')) return 'payments';
  if (c.includes('cms') || c.includes('yayın')) return 'cms';
  if (c.includes('backend') || c.includes('baas')) return 'backend';
  if (c.includes('depolama') || c.includes('veritaban')) return 'database';
  if (c.includes('yapay zeka')) return 'ai';
  if (c.includes('iletişim') || c.includes('destek')) return 'comms';
  if (c.includes('görselleştir') || c.includes('bi')) return 'charts';
  if (c.includes('konteyner')) return 'containers';
  if (c.includes('ağ')) return 'proxy';
  if (c.includes('kimlik') || c.includes('güvenlik')) return 'security';
  if (c.includes('gözlem') || c.includes('izleme')) return 'observability';
  if (c.includes('dokümantasyon') || c.includes('wiki')) return 'docs';
  if (c.includes('arama')) return 'search';
  if (c.includes('analitik')) return 'analytics';
  if (c.includes('otomasyon') || c.includes('iş akışı')) return 'automation';
  if (c.includes('kuyruk') || c.includes('akış')) return 'queue';
  if (c.includes('devops') || c.includes('kaynak kod')) return 'devops';
  if (c.includes('geliştirme')) return 'devtools';
  if (c.includes('e-posta')) return 'email';
  if (c.includes('planlama') || c.includes('randevu')) return 'calendar';
  return 'generic';
}

export function promoImageFor(slug: string, category: string): string {
  return THEME_IMAGE[promoThemeFor(slug, category)];
}
