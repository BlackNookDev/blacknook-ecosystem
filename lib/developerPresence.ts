/** Platform ipuçları ve halka açık aktif geliştirici sayısı */

export type DevPresence = {
  id: string;
  initials: string;
  /** Tailwind-ish bg color */
  color: string;
  role: string;
};

export const DEVELOPERS: DevPresence[] = [
  { id: 'd1', initials: 'AY', color: '#34d399', role: 'Full-stack' },
  { id: 'd2', initials: 'MK', color: '#22d3ee', role: 'DevOps' },
  { id: 'd3', initials: 'EL', color: '#a3e635', role: 'Backend' },
  { id: 'd4', initials: 'SR', color: '#fbbf24', role: 'SaaS' },
  { id: 'd5', initials: 'TN', color: '#60a5fa', role: 'AI' },
  { id: 'd6', initials: 'ZB', color: '#f472b6', role: 'Frontend' },
  { id: 'd7', initials: 'HK', color: '#c084fc', role: 'Auth' },
  { id: 'd8', initials: 'DC', color: '#2dd4bf', role: 'Infra' },
];

export type PlatformHint = {
  id: string;
  message: string;
};

/** Hero alt satır — platform değer önerisi (sahte aktivite yok) */
export const PLATFORM_HINTS: PlatformHint[] = [
  { id: 'h1', message: 'Kurulum Talep Et ile yönetilen onboarding' },
  { id: 'h2', message: 'Katalogdan ajan keşfi · /agent paneli' },
  { id: 'h3', message: 'Destek sohbeti e-posta ile ekibe ulaşır' },
];

/** 3–10 arası; birkaç dakikada bir kayar, 1–2’de takılmaz */
export function getActiveDeveloperCount(now = Date.now()): number {
  const slot = Math.floor(now / (3 * 60_000));
  const wave = Math.sin(slot * 1.73) * 3.4 + Math.cos(slot * 0.91) * 1.9;
  return Math.max(3, Math.min(10, Math.round(6.5 + wave)));
}

export function getRotatingPlatformHint(now = Date.now()): PlatformHint {
  const idx = Math.floor(now / 45_000) % PLATFORM_HINTS.length;
  return PLATFORM_HINTS[idx];
}
