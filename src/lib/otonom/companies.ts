import type { DepartmentSlug } from '@/lib/otonom/catalog';

export const COMPANY_SLUGS = [
  'telekomunikasyon',
  'finans-bankacilik-sigorta',
  'seyahat',
  'saglik',
  'perakende-fmcg',
  'otomotiv',
  'enerji-cevre',
  'devlet-resmi-kurumlar',
  'lojistik',
  'insaat',
] as const;

export type CompanySlug = (typeof COMPANY_SLUGS)[number];

export type CompanyProcess = {
  id: string;
  label: string;
  department: DepartmentSlug;
};

export type CompanyDefinition = {
  slug: CompanySlug;
  name: string;
  shortName: string;
  processes: CompanyProcess[];
};

function process(
  company: CompanySlug,
  label: string,
  department: DepartmentSlug
): CompanyProcess {
  const id = `${company}-${label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}`;
  return { id, label, department };
}

export const COMPANIES: CompanyDefinition[] = [
  {
    slug: 'telekomunikasyon',
    name: 'Telekomünikasyon',
    shortName: 'Telekom',
    processes: [
      process('telekomunikasyon', 'Müşteri Yönetimi', 'satis'),
      process('telekomunikasyon', 'Veri toplama ve konsolidasyonu', 'teknoloji'),
      process('telekomunikasyon', 'Veri geçişi ve girişi', 'teknoloji'),
      process('telekomunikasyon', 'Raporlama', 'finans'),
      process('telekomunikasyon', 'Tahsilat Takibi', 'muhasebe'),
      process('telekomunikasyon', 'Uygulamalar arası veri aktarımı', 'teknoloji'),
      process('telekomunikasyon', 'IT otomasyonları', 'teknoloji'),
      process('telekomunikasyon', 'Rakip fiyat takibi', 'satis'),
    ],
  },
  {
    slug: 'finans-bankacilik-sigorta',
    name: 'Finans, Bankacılık & Sigorta',
    shortName: 'Finans & Sigorta',
    processes: [
      process('finans-bankacilik-sigorta', 'Yeni hesap oluşturma ve doğrulama', 'satis'),
      process('finans-bankacilik-sigorta', 'Veri doğrulama', 'teknoloji'),
      process('finans-bankacilik-sigorta', 'Müşteri hesap yönetimi', 'satis'),
      process('finans-bankacilik-sigorta', 'Kredi ve sigorta uygulamaları', 'operasyon'),
      process('finans-bankacilik-sigorta', 'Raporlama', 'finans'),
      process('finans-bankacilik-sigorta', 'Ödeme ve fatura işlenmesi', 'muhasebe'),
      process('finans-bankacilik-sigorta', 'Varlık analizleri', 'finans'),
      process('finans-bankacilik-sigorta', 'Banka mutabakatları', 'muhasebe'),
      process('finans-bankacilik-sigorta', 'Form yönetimi', 'operasyon'),
      process('finans-bankacilik-sigorta', 'Adres güncellemesi', 'operasyon'),
    ],
  },
  {
    slug: 'seyahat',
    name: 'Seyahat',
    shortName: 'Seyahat',
    processes: [
      process('seyahat', 'Sipariş ve ödeme süreçleri', 'satis'),
      process('seyahat', 'Veri yönetimi', 'teknoloji'),
      process('seyahat', 'Destek hattı operasyonları', 'operasyon'),
      process('seyahat', 'Platformlar arası veri akışı', 'teknoloji'),
      process('seyahat', 'Yönetmelik uyumu kontrolü', 'hukuk'),
      process('seyahat', 'Kişiselleştirilmiş teklifler', 'satis'),
      process('seyahat', 'Evrakların dijitalleştirilmesi', 'operasyon'),
      process('seyahat', 'Öneri / teklif yönetimi', 'satis'),
    ],
  },
  {
    slug: 'saglik',
    name: 'Sağlık',
    shortName: 'Sağlık',
    processes: [
      process('saglik', 'Hasta verilerinin aktarımı', 'saglik-klinik'),
      process('saglik', 'Randevu yönetimi ve bildirimler', 'saglik-klinik'),
      process('saglik', 'Medikal fatura işlenmesi', 'muhasebe'),
      process('saglik', 'Hasta kayıtlarının takibi', 'saglik-klinik'),
      process('saglik', 'Tedarik yönetimi', 'operasyon'),
    ],
  },
  {
    slug: 'perakende-fmcg',
    name: 'Perakende & FMCG',
    shortName: 'Perakende',
    processes: [
      process('perakende-fmcg', 'Katalog ve ürün fiyat takibi', 'e-ticaret'),
      process('perakende-fmcg', 'Envanter yönetimi', 'e-ticaret'),
      process('perakende-fmcg', 'Ürünleri kategorilere ayırma', 'e-ticaret'),
      process('perakende-fmcg', 'Tedarik yönetimi', 'operasyon'),
      process('perakende-fmcg', 'Sipariş yönetimi', 'e-ticaret'),
      process('perakende-fmcg', 'Raporlama', 'finans'),
      process('perakende-fmcg', 'Lojistik yönetimi', 'tedarik-zinciri'),
      process('perakende-fmcg', 'İK yönetimi', 'ik'),
    ],
  },
  {
    slug: 'otomotiv',
    name: 'Otomotiv',
    shortName: 'Otomotiv',
    processes: [
      process('otomotiv', 'Sipariş ve ödeme işlemleri', 'satis'),
      process('otomotiv', 'Rakip takibi', 'satis'),
      process('otomotiv', 'Üretim süreçleri yönetimi', 'operasyon'),
      process('otomotiv', 'Veri depolama ve analizi', 'teknoloji'),
      process('otomotiv', 'Bağlantılı araç entegrasyonu', 'teknoloji'),
      process('otomotiv', 'Operasyon maliyetlerini düşürme', 'finans'),
      process('otomotiv', 'İnovatif çözümler', 'teknoloji'),
      process('otomotiv', 'Tedarikçi yönetimi', 'operasyon'),
      process('otomotiv', 'Evrakların dijitalleştirilmesi', 'operasyon'),
      process('otomotiv', 'Gerçek zamanlı teklifler', 'satis'),
    ],
  },
  {
    slug: 'enerji-cevre',
    name: 'Enerji & Çevre',
    shortName: 'Enerji',
    processes: [
      process('enerji-cevre', 'Destek hattı operasyonları', 'operasyon'),
      process('enerji-cevre', 'Şikayet yönetimi', 'operasyon'),
      process('enerji-cevre', 'Faturalandırma yönetimi', 'muhasebe'),
      process('enerji-cevre', 'Müşteri bilgileri yönetimi', 'satis'),
      process('enerji-cevre', 'Adres değişiklikleri yönetimi', 'operasyon'),
      process('enerji-cevre', 'İzleme ve takip', 'teknoloji'),
      process('enerji-cevre', 'Raporlama', 'finans'),
    ],
  },
  {
    slug: 'devlet-resmi-kurumlar',
    name: 'Devlet & Resmi Kurumlar',
    shortName: 'Kamu',
    processes: [
      process('devlet-resmi-kurumlar', 'Devlet hizmet uygulamaları', 'operasyon'),
      process('devlet-resmi-kurumlar', 'Adres değişiklikleri yönetimi', 'operasyon'),
      process('devlet-resmi-kurumlar', 'Raporlama', 'finans'),
      process('devlet-resmi-kurumlar', 'Tahsilat takibi', 'muhasebe'),
      process('devlet-resmi-kurumlar', 'Destek hattı operasyonları', 'operasyon'),
      process('devlet-resmi-kurumlar', 'Açık devlet hizmetlerinde yetkilendirme', 'teknoloji'),
      process('devlet-resmi-kurumlar', 'Sistemler arası bilgi akışı', 'teknoloji'),
    ],
  },
  {
    slug: 'lojistik',
    name: 'Lojistik',
    shortName: 'Lojistik',
    processes: [
      process('lojistik', 'Sistemler arası veri akışı', 'teknoloji'),
      process('lojistik', 'Manuel veri takibini devre dışı bırakma', 'teknoloji'),
      process('lojistik', 'Sevkiyat takibi ve planlaması', 'tedarik-zinciri'),
      process('lojistik', 'Konteyner ve gecikme izleme', 'tedarik-zinciri'),
      process('lojistik', 'Farklı veri formatlarını işleme', 'teknoloji'),
      process('lojistik', 'Müşteri ilişkileri yönetimi', 'satis'),
      process('lojistik', 'E-posta işleme', 'operasyon'),
      process('lojistik', 'Fatura işleme', 'muhasebe'),
      process('lojistik', 'Sipariş ve envanter takibi', 'tedarik-zinciri'),
      process('lojistik', 'Raporlama', 'finans'),
    ],
  },
  {
    slug: 'insaat',
    name: 'İnşaat & Proje',
    shortName: 'İnşaat',
    processes: [
      process('insaat', 'Şantiye masraf ve fiş girişi', 'insaat'),
      process('insaat', 'ERP taslak fiş onayı', 'muhasebe'),
      process('insaat', 'Proje bazlı maliyet takibi', 'insaat'),
      process('insaat', 'Saha tedarik ve irsaliye', 'operasyon'),
      process('insaat', 'Taşeron sözleşme takibi', 'hukuk'),
      process('insaat', 'İş güvenliği ve uyum', 'uyum'),
      process('insaat', 'Hakediş ve ödeme planı', 'finans'),
      process('insaat', 'Saha ekip iletişimi', 'destek'),
    ],
  },
];

export const DEFAULT_COMPANY_SLUG: CompanySlug = 'telekomunikasyon';

export const COMPANY_STORAGE_KEY = 'bn-agent-company';

export function getCompany(slug: string): CompanyDefinition | null {
  return COMPANIES.find((item) => item.slug === slug) ?? null;
}

export function isCompanySlug(value: string): value is CompanySlug {
  return (COMPANY_SLUGS as readonly string[]).includes(value);
}

export function listProcessesForDepartment(
  companySlug: CompanySlug,
  department: DepartmentSlug
): CompanyProcess[] {
  const company = getCompany(companySlug);
  if (!company) return [];
  return company.processes.filter((item) => item.department === department);
}

export function listDepartmentsWithProcesses(companySlug: CompanySlug) {
  const company = getCompany(companySlug);
  if (!company) return [];

  const grouped = new Map<DepartmentSlug, CompanyProcess[]>();
  for (const item of company.processes) {
    const list = grouped.get(item.department) ?? [];
    list.push(item);
    grouped.set(item.department, list);
  }

  return Array.from(grouped.entries()).map(([department, processes]) => ({
    department,
    processes,
  }));
}
