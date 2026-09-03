/** Giriş sonrası varsayılan rota — Nook Agent kokpiti */
export const NOOK_AGENT_LAUNCH_PATH = '/agent';

/** Eski yol — /agent'e yönlendirilir */
export const NOOK_AGENT_PATH = '/account/nook-agent';

/** Agent uygulaması rotaları (navbar/footer gizle) */
export function isAgentAppPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname === NOOK_AGENT_LAUNCH_PATH ||
    pathname.startsWith(`${NOOK_AGENT_LAUNCH_PATH}/`) ||
    pathname === '/account' ||
    pathname.startsWith('/account/')
  );
}

/** @deprecated isAgentAppPath kullanın */
export function isNookAgentLaunchPath(pathname: string | null): boolean {
  return isAgentAppPath(pathname);
}

export function isNookAgentAccountPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === NOOK_AGENT_PATH || pathname.startsWith(`${NOOK_AGENT_PATH}/`);
}

export function isNookAgentPath(pathname: string | null): boolean {
  return isNookAgentAccountPath(pathname) || isAgentAppPath(pathname);
}
