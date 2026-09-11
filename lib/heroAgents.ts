/** Ana (hero) MCP ajanları — platform vitrininde gösterilen kurumsal ajanlar */
export const HERO_AGENT_SLUGS = [
  'nook-muhasebe-mcp',
  'metabase',
  'plausible',
  'cal-com',
  'chatwoot',
  'outline',
  'shopppro',
] as const;

export type HeroAgentSlug = (typeof HERO_AGENT_SLUGS)[number];

export function isHeroAgentSlug(slug: string): slug is HeroAgentSlug {
  return (HERO_AGENT_SLUGS as readonly string[]).includes(slug);
}

/** @deprecated NOOK_PLATFORM_SLUGS — HERO_AGENT_SLUGS kullanın */
export const NOOK_PLATFORM_SLUGS = HERO_AGENT_SLUGS;
