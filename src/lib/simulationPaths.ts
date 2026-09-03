export function isSimulationPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname.includes('/simulasyon');
}

export const NOOK_MUHASEBE_SIMULATION_PATH = '/service/nook-muhasebe-mcp/simulasyon';
export const CAL_COM_SIMULATION_PATH = '/service/cal-com/simulasyon';
export const METABASE_SIMULATION_PATH = '/service/metabase/simulasyon';
export const PLAUSIBLE_SIMULATION_PATH = '/service/plausible/simulasyon';
export const OUTLINE_SIMULATION_PATH = '/service/outline/simulasyon';
export const CHATWOOT_SIMULATION_PATH = '/service/chatwoot/simulasyon';

const SERVICE_SIMULATION_PATHS: Record<string, string> = {
  'nook-muhasebe-mcp': NOOK_MUHASEBE_SIMULATION_PATH,
  'cal-com': CAL_COM_SIMULATION_PATH,
  metabase: METABASE_SIMULATION_PATH,
  plausible: PLAUSIBLE_SIMULATION_PATH,
  outline: OUTLINE_SIMULATION_PATH,
  chatwoot: CHATWOOT_SIMULATION_PATH,
};

export function getServiceSimulationPath(slug: string): string | undefined {
  return SERVICE_SIMULATION_PATHS[slug];
}

export const SIMULATION_DEFAULT_RETURN_PATH = '/agent';

export function sanitizeSimulationReturnPath(
  path: string | null | undefined,
  fallback = SIMULATION_DEFAULT_RETURN_PATH
): string {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return fallback;
  return path;
}

export function withSimulationReturnPath(href: string, returnTo?: string): string {
  if (!returnTo) return href;
  const safe = sanitizeSimulationReturnPath(returnTo, '');
  if (!safe) return href;
  const separator = href.includes('?') ? '&' : '?';
  return `${href}${separator}return=${encodeURIComponent(safe)}`;
}
