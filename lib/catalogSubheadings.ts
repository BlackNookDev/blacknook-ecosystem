import type { ServiceCatalogEntry } from './data';
import { filterCatalog } from './catalogBrowse';
import { getBrowseCategory } from './navMenus';
import { HERO_AGENT_SLUGS } from './heroAgents';

const SIMULATION_SLUGS = new Set([
  'nook-muhasebe-mcp',
  'cal-com',
  'metabase',
  'plausible',
  'outline',
  'chatwoot',
]);

export type SubheadingDefinition = {
  id: string;
  label: string;
  match: (item: ServiceCatalogEntry) => boolean;
};

export type SubheadingOption = {
  id: string;
  label: string;
  count: number;
};

export const SPECIAL_SUBHEADINGS: SubheadingDefinition[] = [
  {
    id: 'simulasyon',
    label: 'Önizleme',
    match: (item) =>
      Boolean(item.demoUrl?.includes('/simulasyon')) || SIMULATION_SLUGS.has(item.slug),
  },
  {
    id: 'ana-ajan',
    label: 'MCP',
    match: (item) => (HERO_AGENT_SLUGS as readonly string[]).includes(item.slug),
  },
];

function countMatches(list: ServiceCatalogEntry[], definition: SubheadingDefinition): number {
  return list.filter(definition.match).length;
}

export function getCatalogCategorySubheadings(
  catalog: ServiceCatalogEntry[],
  baseList?: ServiceCatalogEntry[]
): SubheadingOption[] {
  const pool = baseList ?? catalog;
  const counts = new Map<string, number>();

  pool.forEach((item) => {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({
      id: `cat:${label}`,
      label,
      count,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'tr'));
}

export function getBrowseMatchSubheadings(
  browseId: string,
  catalog: ServiceCatalogEntry[],
  baseList: ServiceCatalogEntry[]
): SubheadingOption[] {
  const browse = getBrowseCategory(browseId);
  if (!browse) return [];

  return browse.match
    .map((label) => ({
      id: `cat:${label}`,
      label,
      count: baseList.filter((item) => item.category === label).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'tr'));
}

export function getServicesSubheadingOptions(
  catalog: ServiceCatalogEntry[],
  filters: {
    category?: string | null;
    cat?: string | null;
    type?: string | null;
    q?: string | null;
  }
): SubheadingOption[] {
  const baseList = filterCatalog(catalog, {
    category: filters.category && filters.category !== 'Tümü' ? filters.category : null,
    cat: null,
    type: filters.type,
    q: filters.q,
  });

  const browseId =
    filters.category && filters.category !== 'Tümü' ? getBrowseCategory(filters.category)?.id : undefined;

  const categoryOptions = browseId
    ? getBrowseMatchSubheadings(browseId, catalog, baseList)
    : getCatalogCategorySubheadings(catalog, baseList);

  const specialOptions = SPECIAL_SUBHEADINGS.map((definition) => ({
    id: definition.id,
    label: definition.label,
    count: countMatches(baseList, definition),
  })).filter((item) => item.count > 0);

  return [...specialOptions, ...categoryOptions];
}

export function filterBySubheading(
  list: ServiceCatalogEntry[],
  subId: string | null | undefined
): ServiceCatalogEntry[] {
  if (!subId) return list;

  if (subId.startsWith('cat:')) {
    const category = subId.slice(4);
    return list.filter((item) => item.category === category);
  }

  const special = SPECIAL_SUBHEADINGS.find((item) => item.id === subId);
  if (special) return list.filter(special.match);

  return list;
}

/** Departman sayfaları — alt başlık grupları */
export const DEPARTMENT_SUBHEADINGS: Record<string, SubheadingDefinition[]> = {
  'e-ticaret': [
    { id: 'sepet', label: 'Sepet & dönüşüm', match: (s) => /sepet|cart|terk|cross-sell/i.test(haystack(s)) },
    { id: 'iade', label: 'İade & fraud', match: (s) => /iade|sahtekarlık|fraud|return/i.test(haystack(s)) },
    { id: 'fiyat', label: 'Fiyat & rekabet', match: (s) => /fiyat|rakip|stok|katalog/i.test(haystack(s)) },
    { id: 'depo', label: 'Depo & picking', match: (s) => /depo|picking|envanter|stok/i.test(haystack(s)) },
  ],
  insaat: [
    { id: 'masraf', label: 'Masraf & fiş', match: (s) => /masraf|fiş|whatsapp|nook|erp/i.test(haystack(s)) },
    { id: 'proje', label: 'Proje & saha', match: (s) => /proje|şantiye|saha|hakediş/i.test(haystack(s)) },
    { id: 'tedarik', label: 'Tedarik & irsaliye', match: (s) => /tedarik|irsaliye|taşeron/i.test(haystack(s)) },
  ],
  'tedarik-zinciri': [
    { id: 'sevkiyat', label: 'Sevkiyat & kargo', match: (s) => /sevkiyat|kargo|lojistik|konteyner/i.test(haystack(s)) },
    { id: 'gecikme', label: 'Gecikme & izleme', match: (s) => /gecikme|gemi|navlun|takip/i.test(haystack(s)) },
    { id: 'depo', label: 'Depo & rota', match: (s) => /depo|picking|rota|paket/i.test(haystack(s)) },
  ],
  'saglik-klinik': [
    { id: 'kayit', label: 'Hasta kaydı', match: (s) => /fhir|hasta|klinik|kayıt/i.test(haystack(s)) },
    { id: 'randevu', label: 'Randevu & teyit', match: (s) => /randevu|teyit|appointment/i.test(haystack(s)) },
  ],
  operasyon: [
    { id: 'stok', label: 'Stok & depo', match: (s) => /stok|depo|envanter|picking/i.test(haystack(s)) },
    { id: 'lojistik', label: 'Lojistik', match: (s) => /lojistik|kargo|sevkiyat|konteyner/i.test(haystack(s)) },
    { id: 'iade', label: 'İade & kalite', match: (s) => /iade|kalite|ürün iade/i.test(haystack(s)) },
  ],
  satis: [
    { id: 'crm', label: 'CRM & lead', match: (s) => /crm|lead|linkedin|churn/i.test(haystack(s)) },
    { id: 'teklif', label: 'Teklif & RFP', match: (s) => /teklif|rfp|itiraz/i.test(haystack(s)) },
    { id: 'randevu', label: 'Randevu & görüşme', match: (s) => /randevu|cal\.com|görüşme/i.test(haystack(s)) },
  ],
  destek: [
    { id: 'bilet', label: 'Bilet & inbox', match: (s) => /bilet|ticket|destek|chatwoot|çağrı/i.test(haystack(s)) },
    { id: 'kanal', label: 'Çok kanal', match: (s) => /whatsapp|e-posta|canlı|chat/i.test(haystack(s)) },
    { id: 'egitim', label: 'Eğitim & koçluk', match: (s) => /koç|eğitim|temsilci/i.test(haystack(s)) },
  ],
  pazarlama: [
    { id: 'seo', label: 'SEO & içerik', match: (s) => /seo|içerik|link|katalog çevir/i.test(haystack(s)) },
    { id: 'reklam', label: 'Reklam & kampanya', match: (s) => /reklam|kampanya|roas|influencer/i.test(haystack(s)) },
    { id: 'analitik', label: 'Analitik', match: (s) => /plausible|analitik|rakip/i.test(haystack(s)) },
  ],
  finans: [
    { id: 'rapor', label: 'Rapor & BI', match: (s) => /metabase|bi|rapor|pan(o|e)/i.test(haystack(s)) },
    { id: 'muhasebe', label: 'Muhasebe', match: (s) => /muhasebe|fatura|mutabakat|kdv/i.test(haystack(s)) },
    { id: 'risk', label: 'Risk & anomali', match: (s) => /risk|anomali|dolandırıcılık|kredi/i.test(haystack(s)) },
  ],
  muhasebe: [
    { id: 'fatura', label: 'Fatura & fiş', match: (s) => /fatura|fiş|masraf|irsaliye/i.test(haystack(s)) },
    { id: 'erp', label: 'ERP entegrasyon', match: (s) => /erp|logo|mikro|nook/i.test(haystack(s)) },
    { id: 'tahsilat', label: 'Tahsilat & ödeme', match: (s) => /tahsilat|ödeme|vade|çek/i.test(haystack(s)) },
  ],
  hukuk: [
    { id: 'sozlesme', label: 'Sözleşme', match: (s) => /sözleşme|nda|e-imza/i.test(haystack(s)) },
    { id: 'mevzuat', label: 'Mevzuat', match: (s) => /mevzuat|yönetmelik|içtihat/i.test(haystack(s)) },
    { id: 'marka', label: 'Marka & patent', match: (s) => /marka|patent|dava/i.test(haystack(s)) },
  ],
};

function haystack(item: ServiceCatalogEntry): string {
  return [item.name, item.description, item.category, ...item.features].join(' ').toLowerCase();
}

export function getDepartmentSubheadingOptions(
  departmentSlug: string,
  services: ServiceCatalogEntry[]
): SubheadingOption[] {
  const definitions = DEPARTMENT_SUBHEADINGS[departmentSlug] ?? [];
  return definitions
    .map((definition) => ({
      id: definition.id,
      label: definition.label,
      count: services.filter(definition.match).length,
    }))
    .filter((item) => item.count > 0);
}

export function hasCatalogSimulation(item: ServiceCatalogEntry): boolean {
  return Boolean(item.demoUrl?.includes('/simulasyon')) || SIMULATION_SLUGS.has(item.slug);
}

export function filterDepartmentBySubheading(
  services: ServiceCatalogEntry[],
  departmentSlug: string,
  subId: string | null | undefined
): ServiceCatalogEntry[] {
  if (!subId) return services;
  const definition = DEPARTMENT_SUBHEADINGS[departmentSlug]?.find((item) => item.id === subId);
  if (!definition) return services;
  return services.filter(definition.match);
}
