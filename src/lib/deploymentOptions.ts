/** Kurulum talebi — dağıtım / barındırma tercihi */

export const DEPLOYMENT_OPTIONS = [
  {
    id: 'kvkk_cloud',
    label: 'KVKK uyumlu sistemde kurulsun',
    description: 'Türkiye’de KVKK odaklı barındırma ile yönetilen kurulum.',
  },
  {
    id: 'public_cloud',
    label: 'Bulutta kurulsun',
    description: 'AWS vb. bulut altyapısında yönetilen kurulum.',
  },
  {
    id: 'on_prem',
    label: 'Kendi sunucumda kurulsun',
    description: 'On-premise veya müşteri VPC üzerinde yönetilen kurulum.',
  },
] as const;

export type DeploymentOptionId = (typeof DEPLOYMENT_OPTIONS)[number]['id'];

export function isDeploymentOptionId(value: unknown): value is DeploymentOptionId {
  return DEPLOYMENT_OPTIONS.some((o) => o.id === value);
}

export function deploymentOptionLabel(id: DeploymentOptionId | string | null | undefined): string {
  const found = DEPLOYMENT_OPTIONS.find((o) => o.id === id);
  return found?.label ?? (id ? String(id) : 'Belirtilmedi');
}
