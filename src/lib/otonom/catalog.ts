export const HORIZONTAL_DEPARTMENT_SLUGS = [
  'muhasebe',
  'finans',
  'satis',
  'operasyon',
  'ik',
  'teknoloji',
  'hukuk',
  'uyum',
  'pazarlama',
  'destek',
  'satin-alma',
  'yonetim',
] as const;

export const VERTICAL_DEPARTMENT_SLUGS = [
  'e-ticaret',
  'insaat',
  'tedarik-zinciri',
  'saglik-klinik',
] as const;

export const DEPARTMENT_SLUGS = [
  ...HORIZONTAL_DEPARTMENT_SLUGS,
  ...VERTICAL_DEPARTMENT_SLUGS,
] as const;

export type DepartmentSlug = (typeof DEPARTMENT_SLUGS)[number];

export type DepartmentDefinition = {
  slug: DepartmentSlug;
  name: string;
  shortName: string;
  kicker: string;
  description: string;
  scanLabel: string;
  /** Dikey sektör departmanı — sidebar'da ayrı grupta gösterilir */
  vertical?: boolean;
};

export const DEPARTMENTS: DepartmentDefinition[] = [
  {
    slug: 'muhasebe',
    name: 'Muhasebe',
    shortName: 'Muhasebe',
    kicker: 'Faturalar',
    description: 'Gelen faturalar ve ödemeler. Siz onaylamadan para çıkmaz.',
    scanLabel: 'Faturaları tara',
  },
  {
    slug: 'finans',
    name: 'Finans',
    shortName: 'Finans',
    kicker: 'Nakit',
    description: 'Para girişi ve çıkışı. Büyük ödemeler onay ister.',
    scanLabel: 'Nakiti tara',
  },
  {
    slug: 'satis',
    name: 'Satış',
    shortName: 'Satış',
    kicker: 'Müşteriler',
    description: 'Teklifler ve fırsatlar. İndirim için onay gerekir.',
    scanLabel: 'Teklifleri tara',
  },
  {
    slug: 'operasyon',
    name: 'Operasyon',
    shortName: 'Operasyon',
    kicker: 'Teslimat',
    description: 'Kargo, stok ve tedarik. Gecikmeler burada görünür.',
    scanLabel: 'Sevkiyatları tara',
  },
  {
    slug: 'ik',
    name: 'İnsan Kaynakları',
    shortName: 'İK',
    kicker: 'Ekip',
    description: 'İşe alım ve izinler. Maaş teklifi onay ister.',
    scanLabel: 'Talepleri tara',
  },
  {
    slug: 'teknoloji',
    name: 'Teknoloji',
    shortName: 'Teknoloji',
    kicker: 'Sistemler',
    description: 'Bağlantılar ve sistem sağlığı. Arıza burada toplanır.',
    scanLabel: 'Sistemleri tara',
  },
  {
    slug: 'hukuk',
    name: 'Hukuk',
    shortName: 'Hukuk',
    kicker: 'Sözleşmeler',
    description: 'Sözleşme, mevzuat ve marka işleri. Riskli maddeler burada yakalanır.',
    scanLabel: 'Sözleşmeleri tara',
  },
  {
    slug: 'uyum',
    name: 'Güvenlik & Uyum',
    shortName: 'Uyum',
    kicker: 'Denetim',
    description: 'KVKK, güvenlik ve denetim kanıtları. Uyumsuzluk burada görünür.',
    scanLabel: 'Uyumu tara',
  },
  {
    slug: 'pazarlama',
    name: 'Pazarlama',
    shortName: 'Pazarlama',
    kicker: 'Kampanyalar',
    description: 'İçerik, reklam ve rakip izleme. Kampanya performansı burada ölçülür.',
    scanLabel: 'Kampanyaları tara',
  },
  {
    slug: 'destek',
    name: 'Müşteri Destek',
    shortName: 'Destek',
    kicker: 'Talepler',
    description: 'Biletler, çağrılar ve müşteri geri bildirimi. SLA burada takip edilir.',
    scanLabel: 'Talepleri tara',
  },
  {
    slug: 'satin-alma',
    name: 'Satın Alma',
    shortName: 'Satın Alma',
    kicker: 'Tedarik',
    description: 'Tedarikçi, ihale ve teklif süreçleri. Gecikme ve fiyat farkı burada görünür.',
    scanLabel: 'Teklifleri tara',
  },
  {
    slug: 'yonetim',
    name: 'Yönetim',
    shortName: 'Yönetim',
    kicker: 'KPI',
    description: 'Üst düzey özetler ve stratejik metrikler. Bütçe ve hedef sapması burada izlenir.',
    scanLabel: 'Özetleri tara',
  },
  {
    slug: 'e-ticaret',
    name: 'E-Ticaret & Perakende',
    shortName: 'E-Ticaret',
    kicker: 'Mağaza',
    description: 'Sepet, iade, fiyat ve mağaza operasyonları. Dönüşüm ve stok burada izlenir.',
    scanLabel: 'Mağazayı tara',
    vertical: true,
  },
  {
    slug: 'insaat',
    name: 'İnşaat & Proje',
    shortName: 'İnşaat',
    kicker: 'Şantiye',
    description: 'Saha masrafları, proje maliyeti ve saha onayları. Şantiye harcamaları burada toplanır.',
    scanLabel: 'Projeleri tara',
    vertical: true,
  },
  {
    slug: 'tedarik-zinciri',
    name: 'Lojistik & Tedarik',
    shortName: 'Lojistik',
    kicker: 'Sevkiyat',
    description: 'Konteyner, depo ve teslimat zinciri. Gecikme ve rota optimizasyonu burada yönetilir.',
    scanLabel: 'Sevkiyatları tara',
    vertical: true,
  },
  {
    slug: 'saglik-klinik',
    name: 'Sağlık & Klinik',
    shortName: 'Sağlık',
    kicker: 'Hasta',
    description: 'Klinik kayıtları, randevu ve hasta iletişimi. FHIR uyumlu veri akışı burada kurulur.',
    scanLabel: 'Klinik verisini tara',
    vertical: true,
  },
];

export const DEPARTMENT_LABELS: Record<DepartmentSlug, string> = Object.fromEntries(
  DEPARTMENTS.map((department) => [department.slug, department.shortName])
) as Record<DepartmentSlug, string>;

export function getDepartment(slug: string): DepartmentDefinition | null {
  return DEPARTMENTS.find((item) => item.slug === slug) ?? null;
}

export function getHorizontalDepartments(): DepartmentDefinition[] {
  return DEPARTMENTS.filter((item) => !item.vertical);
}

export function getVerticalDepartmentDefinitions(): DepartmentDefinition[] {
  return DEPARTMENTS.filter((item) => item.vertical);
}
