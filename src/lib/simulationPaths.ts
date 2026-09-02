export function isSimulationPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname.includes('/simulasyon');
}

export const NOOK_MUHASEBE_SIMULATION_PATH = '/service/nook-muhasebe-mcp/simulasyon';
export const FLOWISE_SIMULATION_PATH = '/service/flowise/simulasyon';

const SERVICE_SIMULATION_PATHS: Record<string, string> = {
  'nook-muhasebe-mcp': NOOK_MUHASEBE_SIMULATION_PATH,
  flowise: FLOWISE_SIMULATION_PATH,
};

export function getServiceSimulationPath(slug: string): string | undefined {
  return SERVICE_SIMULATION_PATHS[slug];
}
