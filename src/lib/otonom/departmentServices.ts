import type { DepartmentSlug } from '@/lib/otonom/catalog';
import { DEPARTMENT_SLUGS } from '@/lib/otonom/catalog';
import { getFullCatalog } from '../../../lib/data';
import type { ServiceCatalogEntry } from '../../../lib/data';
import { getServiceSimulationPath } from '@/lib/simulationPaths';

export type DepartmentService = {
  slug: string;
  department: DepartmentSlug;
  name: string;
  description: string;
  icon: string;
  brandColor: string;
  href: string;
  simulationPath?: string;
  splashLabel?: string;
};

const CATEGORY_DEPARTMENT: Partial<Record<string, DepartmentSlug>> = {
  'Hukuk & Uyum': 'hukuk',
  'Güvenlik & Uyum': 'uyum',
  'Pazarlama & Analiz': 'pazarlama',
  'Müşteri Destek': 'destek',
  'Satın Alma': 'satin-alma',
  'Yönetim': 'yonetim',
  'Satış & CRM': 'satis',
  'E-ticaret & Operasyon': 'e-ticaret',
  'İnsan Kaynakları': 'ik',
  'Yazılım & DevOps': 'teknoloji',
  'IT & Operasyon': 'teknoloji',
  Operasyon: 'operasyon',
  'Sunucu ve altyapı': 'teknoloji',
  'Veri & Raporlama': 'finans',
  'Yapay Zeka': 'teknoloji',
  'Sektörel Çözümler': 'saglik-klinik',
};

const SLUG_DEPARTMENT_BOOSTS: Partial<Record<string, Partial<Record<DepartmentSlug, number>>>> = {
  'nook-muhasebe-mcp': { insaat: 25, muhasebe: 8 },
  shopppro: { 'e-ticaret': 25, satis: 10, operasyon: 8 },
};

const DEPARTMENT_KEYWORDS: Record<DepartmentSlug, string[]> = {
  muhasebe: ['muhasebe', 'nook', 'fatura', 'irsaliye', 'fiş', 'masraf', 'mutabakat', 'tahsilat', 'bordro', 'ödeme hatırlatma', 'gümrük beyan'],
  finans: ['finans', 'metabase', 'bi', 'analitik', 'plausible', 'gelir', 'kredi risk', 'anomali', 'dolandırıcılık', 'yatırımcı', 'kdv', 'vat', 'nakit', 'dbt', 'clickhouse'],
  satis: ['satış', 'chatwoot', 'crm', 'teklif', 'rfp', 'churn', 'cross-sell', 'soğuk satış', 'linkedin', 'cal.com', 'randevu', 'lead', 'itiraz', 'pazar yeri fiyat'],
  operasyon: ['operasyon', 'stok', 'depo', 'lojistik', 'kargo', 'franchise', 'picking', 'iade', 'sepet', 'paketleme', 'gtip', 'ihracat', 'workflow', 'cdn', 'dns'],
  ik: ['insan kaynakları', 'personel', 'onboarding', 'offboarding', 'cv', 'ilan', 'stajyer', 'eğitim', 'quiz', 'wiki', 'outline', 'vesting', 'opsiyon'],
  teknoloji: ['yazılım', 'devops', 'postgres', 'sqlite', 'redis', 'github', 'gitlab', 'supabase', 'elastic', 'qdrant', 'chroma', 'api', 'migration', 'playwright', 'aws', 'cloudflare', 'mcp', 'kod', 'sentry', 'mikroservis', 'yedekleme', 'schema'],
  hukuk: ['hukuk', 'sözleşme', 'nda', 'dava', 'içtihat', 'patent', 'marka', 'mevzuat', 'yönetmelik', 'e-imza', 'etik hat', 'ihbar', 'çok dilli sözleşme'],
  uyum: ['güvenlik', 'uyum', 'kvkk', 'pii', 'soc2', 'iso', 'cve', 'secret', 'sızıntı', 'waf', 'lisans denet', 'denetim kanıt', 'yama bildir', 'permission matrix', 'güvenlik zafiyet'],
  pazarlama: ['pazarlama', 'seo', 'kampanya', 'reklam', 'roas', 'influencer', 'e-bülten', 'unsubscribe', 'rakip fiyat', 'rakip ürün', 'sosyal medya kriz', 'bozuk link', 'katalog çevir', 'plausible'],
  destek: ['müşteri destek', 'destek', 'bilet', 'çağrı merkezi', 'chatwoot', 'randevu teyit', 'yorum yanıt', 'l1', 'ticket', 'geri bildirim', 'koç', 'fhir', 'sağlık veri', 'garanti'],
  'satin-alma': ['satın alma', 'tedarikçi', 'ihale', 'şartname', 'teklif karşılaştır', 'sla teslimat', 'fiyat liste', 'tedarik'],
  yonetim: ['yönetim', 'ceo', 'executive', 'yatırımcı ilişkileri', 'bütçe aşım', 'karbon', 'haftalık yönetim', 'seyahat koordinatör'],
  'e-ticaret': [
    'e-ticaret', 'perakende', 'mağaza', 'sepet', 'iade', 'picking', 'stok', 'katalog', 'rakip fiyat',
    'cross-sell', 'cart', 'marketplace', 'sahtekarlık', 'ürün iade', 'mağaza ziyaret', 'fiyat liste',
    'shopppro', 'trendyol', 'hepsiburada', 'pazaryeri', 'kargo',
  ],
  insaat: [
    'inşaat', 'şantiye', 'nook', 'saha', 'masraf', 'proje', 'hakediş', 'taşeron', 'logo tiger', 'mikro erp',
    'whatsapp masraf', 'şantiye masraf', 'taslak fiş',
  ],
  'tedarik-zinciri': [
    'lojistik', 'konteyner', 'sevkiyat', 'navlun', 'depo', 'kargo', 'gemi', 'tedarik zinciri',
    'picking route', 'gtip', 'ihracat', 'franchise', 'paketleme',
  ],
  'saglik-klinik': [
    'sağlık', 'klinik', 'hasta', 'fhir', 'randevu teyit', 'medikal', 'klinik kayıt', 'appointment',
    'tıbbi', 'hastane',
  ],
};

function haystack(service: ServiceCatalogEntry): string {
  return [service.name, service.description, service.category, ...service.features].join(' ').toLowerCase();
}

function scoreForDepartment(service: ServiceCatalogEntry, department: DepartmentSlug): number {
  const categoryMatch = CATEGORY_DEPARTMENT[service.category];
  let score = categoryMatch === department ? 12 : 0;

  if (service.category === 'Muhasebe & Finans') {
    if (department === 'muhasebe' || department === 'finans') {
      score += 4;
    }
  }

  const text = haystack(service);
  score += DEPARTMENT_KEYWORDS[department].reduce(
    (sum, keyword) => sum + (text.includes(keyword) ? 1 : 0),
    0
  );

  score += SLUG_DEPARTMENT_BOOSTS[service.slug]?.[department] ?? 0;

  return score;
}

function toDepartmentService(service: ServiceCatalogEntry, department: DepartmentSlug): DepartmentService {
  const simulationPath = getServiceSimulationPath(service.slug);
  return {
    slug: service.slug,
    department,
    name: service.name,
    description: service.description,
    icon: service.icon,
    brandColor: service.brandColor,
    href: `/service/${service.slug}`,
    simulationPath,
    splashLabel: simulationPath ? service.name : undefined,
  };
}

export function listDepartmentServices(department: DepartmentSlug): DepartmentService[] {
  const catalog = getFullCatalog();
  const scored = catalog
    .map((service) => ({ service, score: scoreForDepartment(service, department) }))
    .filter((item) => item.score > 0);

  scored.sort((a, b) => b.score - a.score || a.service.name.localeCompare(b.service.name, 'tr'));
  return scored.map((item) => toDepartmentService(item.service, department));
}

export function listAllDepartmentServices(): DepartmentService[] {
  const catalog = getFullCatalog();
  const best = new Map<string, { service: DepartmentService; score: number }>();

  for (const department of DEPARTMENT_SLUGS) {
    for (const item of catalog) {
      const score = scoreForDepartment(item, department);
      if (score <= 0) continue;
      const service = toDepartmentService(item, department);
      const existing = best.get(item.slug);
      if (!existing || score > existing.score) {
        best.set(item.slug, { service, score });
      }
    }
  }

  return Array.from(best.values())
    .map((entry) => entry.service)
    .sort((a, b) => a.name.localeCompare(b.name, 'tr'));
}

export function formatTokenCount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

export function mockMetricsForService(_slug: string) {
  return {
    status: 'idle' as const,
    efficiencyPercent: 0,
    hoursSavedWeek: 0,
    tokensToday: 0,
    tokenBudgetDaily: 0,
    avgResponseMs: 0,
    lastRunMs: 0,
    maxWorkers: 1,
    queuedJobs: 0,
  };
}
