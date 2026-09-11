/** Hub / stack kanalı — şu an yalnızca `service` dolu */
export type CatalogChannel = 'service' | 'saas' | 'micro-saas' | 'script';

export type ComingSoonCopy = {
  title: string;
  eyebrow: string;
  body: string;
  bullets: string[];
};

const COMING_SOON: Record<Exclude<CatalogChannel, 'service'>, ComingSoonCopy> = {
  saas: {
    eyebrow: 'Yakında',
    title: 'Bulut yazılım yakında',
    body: 'Bulut yazılımları için ayrı bir keşif yüzeyi açılacak. Şimdilik ajan kataloğu ve yönetilen kurulum canlı.',
    bullets: [
      'Seçilmiş bulut yazılımları',
      'Katalog üzerinden keşif',
      'Kurulum talepleri Ekosistem’de devam ediyor',
    ],
  },
  'micro-saas': {
    eyebrow: 'Yakında',
    title: 'Mini yazılım yakında',
    body: 'Dar kapsamlı araçlar için ayrı bir hub planlanıyor. Bugün ajan kataloğundan keşfedebilirsiniz.',
    bullets: [
      'Tek amaçlı mini yazılımlar',
      'Hızlı keşif',
      'Kurulum Talep Et ile onboarding',
    ],
  },
  script: {
    eyebrow: 'Yakında',
    title: 'Betikler yakında',
    body: 'Küçük betikler ve otomasyon paketleri için ayrı hub açılacak. Kurulum talepleri şimdilik ajan kataloğundan.',
    bullets: [
      'Hazır betik ve otomasyon paketleri',
      'Teknik araçlar',
      'Kurulum talebi katalog üzerinden',
    ],
  },
};

export function isComingSoonMenuId(id: string | null | undefined): boolean {
  return id === 'script';
}

export function getComingSoonCopy(id: string): ComingSoonCopy | null {
  if (id === 'saas' || id === 'micro-saas' || id === 'script') {
    return COMING_SOON[id];
  }
  return null;
}
