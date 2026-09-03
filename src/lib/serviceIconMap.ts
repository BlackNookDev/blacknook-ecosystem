import type { IconType } from 'react-icons';
import {
  SiCaldotcom,
  SiChatwoot,
  SiMetabase,
  SiOutline,
  SiPlausibleanalytics,
} from 'react-icons/si';

/** Brands not in Simple Icons / react-icons — static or third-party logo URL */
export const CUSTOM_LOGO_URLS: Record<string, string> = {
  'nook-muhasebe-mcp': '/bn-mark.png',
};

export const SIMPLE_ICON_SLUG_ALIASES: Record<string, string> = {};

export const SERVICE_ICON_MAP: Record<string, IconType> = {
  plausibleanalytics: SiPlausibleanalytics,
  metabase: SiMetabase,
  caldotcom: SiCaldotcom,
  outline: SiOutline,
  chatwoot: SiChatwoot,
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

export function iconDisplayColor(hex: string, theme: LogoThemeMode = 'dark'): string {
  if (theme === 'light') {
    return hexLuminance(hex) > 0.72 ? '#3f3f46' : hex;
  }
  return hexLuminance(hex) < 0.38 ? '#F4F4F5' : hex;
}

const LIGHT_PLATE_KEYS = new Set<string>();

function fileStem(src: string) {
  return src.split('?')[0].split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') ?? '';
}

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
