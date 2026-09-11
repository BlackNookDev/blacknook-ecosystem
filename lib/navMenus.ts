import { getFullCatalog, type ServiceCatalogEntry } from './data';

export type NavMenuId = 'saas' | 'micro-saas' | 'script' | 'services';

export type BrowseCategory = {
  id: string;
  label: string;
  description: string;
  /** Eşleşen katalog kategorileri */
  match: string[];
  /** Belirli ürün slug'ları (NOOK platformu gibi) */
  slugs?: string[];
};

/** Üst kategori listesi — MCP ajanları + NOOK ürünleri */
export const BROWSE_CATEGORIES: BrowseCategory[] = [
  {
    id: 'operasyon',
    label: 'Operasyon & lojistik',
    description: 'Stok, depo, kargo, tedarik ve operasyon otomasyonu.',
    match: ['Operasyon', 'Satın Alma', 'IT & Operasyon', 'E-ticaret & Operasyon'],
  },
  {
    id: 'satis-crm',
    label: 'Satış & CRM',
    description: 'Lead, teklif, churn ve müşteri ilişkileri ajanları.',
    match: ['Satış & CRM'],
  },
  {
    id: 'finans',
    label: 'Finans & muhasebe',
    description: 'Muhasebe, raporlama, BI ve finansal analiz.',
    match: ['Muhasebe & Finans', 'Veri & Raporlama', 'BI & Görselleştirme'],
  },
  {
    id: 'pazarlama',
    label: 'Pazarlama & analiz',
    description: 'Kampanya, SEO, reklam ve ürün analitiği.',
    match: ['Pazarlama & Analiz', 'Analitik & Ürün'],
  },
  {
    id: 'ik',
    label: 'İnsan kaynakları',
    description: 'İşe alım, onboarding, eğitim ve personel süreçleri.',
    match: ['İnsan Kaynakları'],
  },
  {
    id: 'hukuk',
    label: 'Hukuk & uyum',
    description: 'Sözleşme, mevzuat ve hukuki süreç otomasyonu.',
    match: ['Hukuk & Uyum'],
  },
  {
    id: 'guvenlik',
    label: 'Güvenlik & uyum',
    description: 'KVKK, denetim, güvenlik ve uyumluluk ajanları.',
    match: ['Güvenlik & Uyum'],
  },
  {
    id: 'destek',
    label: 'Müşteri destek',
    description: 'Destek, iletişim, randevu ve sektörel çözümler.',
    match: [
      'Müşteri Destek',
      'İletişim & Destek',
      'Sektörel Çözümler',
      'Planlama & Randevu',
      'Dokümantasyon & Wiki',
    ],
  },
  {
    id: 'yazilim',
    label: 'Yazılım & teknoloji',
    description: 'DevOps, altyapı, yapay zeka ve otomasyon araçları.',
    match: [
      'Yazılım & DevOps',
      'Sunucu ve altyapı',
      'Yapay Zeka',
      'Otomasyon & İş Akışı',
    ],
  },
  {
    id: 'yonetim',
    label: 'Yönetim',
    description: 'Yönetim kurulu, bütçe ve strateji odaklı ajanlar.',
    match: ['Yönetim'],
  },
];

export type NavMenuConfig = {
  id: NavMenuId;
  label: string;
  href: string;
  channel: 'service' | 'saas' | 'micro-saas' | 'script';
  comingSoon?: boolean;
  dropdownItems: { label: string; href: string }[];
  filterCategories?: string[];
};

export const NAV_MENUS: NavMenuConfig[] = [
  {
    id: 'services',
    label: 'Ajan kataloğu',
    href: '/services',
    channel: 'service',
    dropdownItems: [],
  },
];

/** Navbar “Ekosistem” mega menü — B2B ajan / departman odaklı */
export const ECOSYSTEM_NAV = {
  label: 'Ekosistem',
  href: '/services',
  browseAllLabel: 'Tüm ajan kataloğunu keşfet',
  categories: [
    ...BROWSE_CATEGORIES.map((c) => ({
      label: c.label,
      href: `/services?category=${c.id}`,
      description: c.description,
    })),
  ],
  trending: [
    {
      title: 'NOOK Agent paneli',
      description: 'Departman bazlı MCP ajanlarını yönetin.',
      href: '/agent',
      badge: 'MCP' as const,
    },
    {
      title: 'Ajan kataloğu',
      description: 'Departman odaklı kurumsal ajanlar.',
      href: '/services',
    },
    {
      title: 'NOOK Muhasebe',
      description: 'WhatsApp masraflarını ERP taslak fişine aktarın.',
      href: '/service/nook-muhasebe-mcp',
    },
    {
      title: 'Shopppro',
      description: 'YZ destekli e-ticaret MCP’si — pazaryeri, stok ve kargo.',
      href: '/service/shopppro',
    },
    {
      title: 'Satış & CRM',
      description: 'Lead, teklif ve müşteri ilişkileri ajanları.',
      href: '/agent/departments/satis',
    },
    {
      title: 'İnşaat & saha',
      description: 'Şantiye masrafı ve operasyon ajanları.',
      href: '/agent/departments/insaat',
    },
  ],
  featured: {
    title: 'Departman paneli',
    description: 'Ajan kataloğundan keşfedin; /agent üzerinde departman kokpitinde işletin.',
    href: '/agent',
    cta: 'Panele git',
  },
};

/** @deprecated — ECOSYSTEM_NAV kullanın */
export const CATEGORIES_NAV = {
  label: ECOSYSTEM_NAV.label,
  href: ECOSYSTEM_NAV.href,
  items: [
    { label: 'Ekosistem', href: '/services' },
    { label: 'Mini yazılım', href: '/services?type=micro-saas' },
    { label: 'Bulut yazılım', href: '/services?type=saas' },
    { label: 'Betikler', href: '/services?type=script' },
  ],
} as const;

export function getBrowseCategory(id: string): BrowseCategory | undefined {
  return BROWSE_CATEGORIES.find((c) => c.id === id);
}

export function getServicesForBrowseCategory(id: string): ServiceCatalogEntry[] {
  const cat = getBrowseCategory(id);
  const catalog = getFullCatalog();
  if (!cat) return catalog;
  return catalog.filter(
    (s) => cat.match.includes(s.category) || cat.slugs?.includes(s.slug)
  );
}

export function getNavMenuServices(
  menu: NavMenuConfig,
  options?: { cat?: string; limit?: number }
): ServiceCatalogEntry[] {
  if (menu.comingSoon || menu.channel !== 'service') {
    return [];
  }

  let list = getFullCatalog();

  if (options?.cat) {
    list = list.filter((s) => s.category === options.cat);
  }

  return options?.limit ? list.slice(0, options.limit) : list;
}
