import { type ServiceCatalogEntry } from './data';
import { BROWSE_CATEGORIES, getBrowseCategory } from './navMenus';

export type BrowseBadge = 'select' | 'new' | null;

/** Kitle etiketleri (Best for) — ileride gerçek etiketler için tutuluyor */
export const BEST_FOR_OPTIONS = [
  { id: 'developers', label: 'Geliştiriciler' },
  { id: 'startups', label: 'Girişimler' },
  { id: 'agencies', label: 'Ajanslar' },
  { id: 'marketers', label: 'Pazarlamacılar' },
  { id: 'creators', label: 'İçerik üreticileri' },
  { id: 'ops', label: 'Operasyon ekipleri' },
] as const;

export type BestForId = (typeof BEST_FOR_OPTIONS)[number]['id'];

const BEST_FOR_BY_CATEGORY: Record<string, BestForId[]> = {
  'Backend & BaaS': ['developers', 'startups'],
  'Kaynak Kodu & DevOps': ['developers', 'ops'],
  'Geliştirme Araçları': ['developers'],
  'Depolama & Veritabanı': ['developers', 'ops'],
  'Yapay Zeka': ['developers', 'startups', 'creators'],
  'Otomasyon & İş Akışı': ['agencies', 'ops', 'marketers'],
  'Yayın & CMS': ['creators', 'marketers', 'agencies'],
  'Dokümantasyon & Wiki': ['creators', 'ops', 'agencies'],
  'Analitik & Ürün': ['marketers', 'startups', 'ops'],
  'E-posta & Pazarlama': ['marketers', 'agencies', 'creators'],
  'E-posta Altyapısı': ['ops', 'developers', 'agencies'],
  'BI & Görselleştirme': ['ops', 'marketers'],
  'Arama': ['developers', 'startups'],
  'İletişim & Destek': ['agencies', 'ops', 'startups'],
  'Planlama & Randevu': ['agencies', 'ops', 'startups'],
  'Kimlik & Güvenlik': ['developers', 'ops'],
  'Gözlemlenebilirlik': ['developers', 'ops'],
  'İzleme & Güvenilirlik': ['ops', 'developers'],
  'Platform & Dağıtım': ['developers', 'ops', 'startups'],
  'Konteyner & Ağ': ['developers', 'ops'],
  'Mesaj Kuyruğu & Akış': ['developers', 'ops'],
};

export const INTEGRATION_OPTIONS = [
  { id: 'docker', label: 'Docker' },
  { id: 'stripe', label: 'Stripe' },
  { id: 'postgres', label: 'PostgreSQL' },
  { id: 'redis', label: 'Redis' },
  { id: 'kubernetes', label: 'Kubernetes' },
  { id: 'slack', label: 'Slack' },
  { id: 'github', label: 'GitHub' },
  { id: 'api', label: 'REST API' },
] as const;

export type IntegrationId = (typeof INTEGRATION_OPTIONS)[number]['id'];

const INTEGRATION_KEYWORDS: Record<IntegrationId, string[]> = {
  docker: ['docker'],
  stripe: ['stripe'],
  postgres: ['postgres', 'postgresql', 'pg '],
  redis: ['redis'],
  kubernetes: ['kubernetes', 'k8s'],
  slack: ['slack'],
  github: ['github', 'git '],
  api: ['api', 'rest', 'graphql'],
};

export function getServiceBestFor(service: ServiceCatalogEntry): BestForId[] {
  return BEST_FOR_BY_CATEGORY[service.category] ?? ['developers', 'startups'];
}

export function getServiceIntegrations(service: ServiceCatalogEntry): IntegrationId[] {
  const blob = `${service.description} ${service.about} ${service.features.join(' ')}`.toLowerCase();
  return INTEGRATION_OPTIONS.map((o) => o.id).filter((id) =>
    INTEGRATION_KEYWORDS[id].some((kw) => blob.includes(kw))
  );
}

export function getBrowseBadge(_service: ServiceCatalogEntry, _index = 0): BrowseBadge {
  return null;
}

export function getBrowseReviewCount(_service: ServiceCatalogEntry): number {
  return 0;
}

export function countByBestFor(list: ServiceCatalogEntry[]): Record<BestForId, number> {
  const counts = Object.fromEntries(BEST_FOR_OPTIONS.map((o) => [o.id, 0])) as Record<
    BestForId,
    number
  >;
  list.forEach((s) => {
    getServiceBestFor(s).forEach((id) => {
      counts[id] += 1;
    });
  });
  return counts;
}

export function countByIntegration(list: ServiceCatalogEntry[]): Record<IntegrationId, number> {
  const counts = Object.fromEntries(INTEGRATION_OPTIONS.map((o) => [o.id, 0])) as Record<
    IntegrationId,
    number
  >;
  list.forEach((s) => {
    getServiceIntegrations(s).forEach((id) => {
      counts[id] += 1;
    });
  });
  return counts;
}

export function countBySubcategory(list: ServiceCatalogEntry[]): { label: string; count: number }[] {
  const map = new Map<string, number>();
  list.forEach((s) => map.set(s.category, (map.get(s.category) ?? 0) + 1));
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'tr'));
}

export function browseHeading(categoryId: string): string {
  const browse = getBrowseCategory(categoryId);
  if (!browse) return 'Ekosistemi keşfet';
  return `${browse.label} çözümleri`;
}

export function getShopByLinks(categoryId: string) {
  const browse = getBrowseCategory(categoryId);
  if (browse) {
    return browse.match.map((label) => ({
      label,
      href: `/services?category=${browse.id}&cat=${encodeURIComponent(label)}`,
      cat: label,
    }));
  }
  return BROWSE_CATEGORIES.map((c) => ({
    label: c.label,
    href: `/services?category=${c.id}`,
    cat: c.id,
  }));
}
