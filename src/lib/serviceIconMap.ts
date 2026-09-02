import type { IconType } from 'react-icons';
import {
  SiApachekafka,
  SiAppwrite,
  SiCaldotcom,
  SiChatwoot,
  SiClickhouse,
  SiCoolify,
  SiDirectus,
  SiElasticsearch,
  SiGhost,
  SiGitea,
  SiGitlab,
  SiGrafana,
  SiHasura,
  SiHoppscotch,
  SiKeycloak,
  SiListmonk,
  SiMattermost,
  SiMeilisearch,
  SiMetabase,
  SiMinio,
  SiMongodb,
  SiMysql,
  SiN8N,
  SiNginxproxymanager,
  SiNotion,
  SiOllama,
  SiOutline,
  SiPlausibleanalytics,
  SiPocketbase,
  SiPortainer,
  SiPostgresql,
  SiPosthog,
  SiPrometheus,
  SiRabbitmq,
  SiRedis,
  SiRocketdotchat,
  SiSentry,
  SiStrapi,
  SiSupabase,
  SiTraefikproxy,
  SiUmami,
  SiUptimekuma,
  SiVaultwarden,
  SiWordpress,
} from 'react-icons/si';

const HOMARR_ICONS =
  'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png';

/** Simple Icons CDN slug differs from our `icon` key in data.ts */
export const SIMPLE_ICON_SLUG_ALIASES: Record<string, string> = {
  rocketchat: 'rocketdotchat',
  superset: 'apachesuperset',
};

/** Brands not in Simple Icons / react-icons — static or third-party logo URL */
export const CUSTOM_LOGO_URLS: Record<string, string> = {
  'nook-muhasebe-mcp': '/bn-mark.png',
  mailcow: `${HOMARR_ICONS}/mailcow.png`,
  typesense: `${HOMARR_ICONS}/typesense.png`,
  openwebui: `${HOMARR_ICONS}/open-webui.png`,
  flowise: `${HOMARR_ICONS}/flowise.png`,
  langfuse: '/service-logos/langfuse.png',
  dokku: '/service-logos/dokku.svg',
  activepieces: '/service-logos/activepieces.png',
  jan: '/service-logos/jan.png',
  anythingllm: '/service-logos/anything-llm.png',
  dokploy: '/service-logos/dokploy.png',
  medusa: '/service-logos/medusa.png',
  caprover: '/service-logos/caprover.png',
  superset: '/service-logos/apache-superset.png',
  typebot: '/service-logos/typebot.png',
  mastra: '/service-logos/mastra.png',
  stagehand: '/service-logos/stagehand.png',
  strix: '/service-logos/strix.png',
  lightdash: '/service-logos/lightdash.png',
  corteza: '/service-logos/corteza.png',
  krayin: '/service-logos/krayin.png',
  btcpay: '/service-logos/btcpay.png',
};

export const SERVICE_ICON_MAP: Record<string, IconType> = {
  ghost: SiGhost,
  appwrite: SiAppwrite,
  supabase: SiSupabase,
  plausibleanalytics: SiPlausibleanalytics,
  n8n: SiN8N,
  minio: SiMinio,
  redis: SiRedis,
  postgresql: SiPostgresql,
  metabase: SiMetabase,
  meilisearch: SiMeilisearch,
  wordpress: SiWordpress,
  umami: SiUmami,
  grafana: SiGrafana,
  prometheus: SiPrometheus,
  directus: SiDirectus,
  strapi: SiStrapi,
  keycloak: SiKeycloak,
  vaultwarden: SiVaultwarden,
  gitea: SiGitea,
  gitlab: SiGitlab,
  portainer: SiPortainer,
  traefikproxy: SiTraefikproxy,
  nginxproxymanager: SiNginxproxymanager,
  uptimekuma: SiUptimekuma,
  sentry: SiSentry,
  posthog: SiPosthog,
  caldotcom: SiCaldotcom,
  outline: SiOutline,
  notion: SiNotion,
  chatwoot: SiChatwoot,
  mattermost: SiMattermost,
  listmonk: SiListmonk,
  elasticsearch: SiElasticsearch,
  mongodb: SiMongodb,
  mysql: SiMysql,
  clickhouse: SiClickhouse,
  rabbitmq: SiRabbitmq,
  apachekafka: SiApachekafka,
  ollama: SiOllama,
  coolify: SiCoolify,
  pocketbase: SiPocketbase,
  hasura: SiHasura,
  hoppscotch: SiHoppscotch,
  rocketchat: SiRocketdotchat,
};

export function simpleIconSlug(iconKey: string) {
  return SIMPLE_ICON_SLUG_ALIASES[iconKey] ?? iconKey;
}

export function brandLogoUrl(iconKey: string, hex: string) {
  const slug = simpleIconSlug(iconKey);
  return `https://cdn.simpleicons.org/${slug}/${hex.replace('#', '')}`;
}

export function hexLuminance(hex: string): number {
  const raw = hex.replace('#', '');
  const h =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  if (h.length < 6) return 0.5;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return 0.5;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export type LogoThemeMode = 'dark' | 'light';

/** Dark brand colors disappear on zinc cards — lift icon tint when needed */
export function iconDisplayColor(hex: string, theme: LogoThemeMode = 'dark'): string {
  if (theme === 'light') {
    return hexLuminance(hex) > 0.72 ? '#3f3f46' : hex;
  }
  return hexLuminance(hex) < 0.38 ? '#F4F4F5' : hex;
}

/** Dark-on-transparent marks that need a light plate */
const LIGHT_PLATE_KEYS = new Set(['medusa']);

function fileStem(src: string) {
  return src.split('?')[0].split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') ?? '';
}

/**
 * Logo tile: dark by default (icons are lightened for this theme).
 * Light plate only for dark glyphs that would vanish on zinc.
 */
export function logoPlateTone(
  iconKey: string,
  brandColor: string,
  theme: LogoThemeMode = 'dark'
): 'light' | 'dark' {
  const resolved = resolveServiceLogo(iconKey, brandColor, theme);

  if (theme === 'light') {
    if (resolved.kind === 'icon') return 'light';

    const src = resolved.src;
    const stem = fileStem(src);
    if (LIGHT_PLATE_KEYS.has(iconKey) || LIGHT_PLATE_KEYS.has(stem)) return 'light';

    const simple = src.match(/cdn\.simpleicons\.org\/[^/]+\/([0-9A-Fa-f]{3,8})/i);
    if (simple && hexLuminance(simple[1]) > 0.72) return 'dark';

    return 'light';
  }

  if (resolved.kind === 'icon') return 'dark';

  const src = resolved.src;
  const stem = fileStem(src);
  if (LIGHT_PLATE_KEYS.has(iconKey) || LIGHT_PLATE_KEYS.has(stem)) return 'light';

  const simple = src.match(/cdn\.simpleicons\.org\/[^/]+\/([0-9A-Fa-f]{3,8})/i);
  if (simple) return hexLuminance(simple[1]) < 0.45 ? 'light' : 'dark';

  return 'dark';
}

export function isCatalogMarkImage(src: string) {
  return src.includes('bn-mark');
}

export function resolveServiceLogo(
  iconKey: string,
  brandColor: string,
  theme: LogoThemeMode = 'dark'
) {
  if (
    iconKey.startsWith('/') ||
    iconKey.startsWith('http://') ||
    iconKey.startsWith('https://') ||
    iconKey.startsWith('data:')
  ) {
    return { kind: 'image' as const, src: iconKey };
  }
  if (iconKey in SERVICE_ICON_MAP) {
    const Icon = SERVICE_ICON_MAP[iconKey];
    return { kind: 'icon' as const, Icon, color: iconDisplayColor(brandColor, theme) };
  }
  const customUrl = CUSTOM_LOGO_URLS[iconKey];
  if (customUrl) {
    return { kind: 'image' as const, src: customUrl };
  }
  return {
    kind: 'image' as const,
    src: brandLogoUrl(iconKey, iconDisplayColor(brandColor, theme)),
  };
}
