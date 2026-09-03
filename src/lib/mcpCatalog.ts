import type { DepartmentSlug } from '@/lib/otonom/catalog';
import { DEPARTMENT_SLUGS } from '@/lib/otonom/catalog';
import { listMcpIntegrations, type McpIntegration } from '@/lib/mcpCustomerCatalog';

export type McpServerEntry = McpIntegration;

const CATEGORY_DEPARTMENT: Partial<Record<string, DepartmentSlug>> = {
  'Hukuk & Uyum': 'hukuk',
  'Güvenlik & Uyum': 'uyum',
  'Pazarlama & Analiz': 'pazarlama',
  'Müşteri Destek': 'destek',
  'Satın Alma': 'satin-alma',
  'Yönetim': 'yonetim',
  'Satış & CRM': 'satis',
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
  'healthcare-fhir': { 'saglik-klinik': 20 },
  'healthcare-fhir-agent': { 'saglik-klinik': 20 },
};

const DEPARTMENT_KEYWORDS: Record<DepartmentSlug, string[]> = {
  muhasebe: ['muhasebe', 'fatura', 'irsaliye', 'fiş', 'masraf', 'mutabakat', 'tahsilat', 'gümrük beyan', 'stripe', 'erp'],
  finans: ['finans', 'analitik', 'bi', 'gelir', 'kredi', 'anomali', 'dolandırıcılık', 'yatırımcı', 'kdv', 'vat', 'dbt', 'clickhouse', 'superset'],
  satis: ['satış', 'crm', 'linkedin', 'teklif', 'rfp', 'churn', 'cross-sell', 'zapier', 'lead', 'itiraz', 'pazar yeri'],
  operasyon: ['operasyon', 'stok', 'depo', 'lojistik', 'franchise', 'iade', 'sepet', 'gtip', 'cdn', 'aws', 'cloudflare'],
  ik: ['insan kaynakları', 'onboarding', 'offboarding', 'cv', 'ilan', 'stajyer', 'eğitim', 'wiki', 'ghost', 'vesting'],
  teknoloji: [
    'yazılım', 'devops', 'postgres', 'redis', 'github', 'gitlab', 'supabase', 'elastic', 'qdrant', 'chroma',
    'yapay zeka', 'veri', 'entegrasyon', 'kod', 'api', 'playwright', 'huggingface', 'mcp', 'migration', 'sentry',
  ],
  hukuk: ['hukuk', 'sözleşme', 'nda', 'dava', 'içtihat', 'patent', 'marka', 'mevzuat', 'e-imza', 'etik hat', 'ihbar'],
  uyum: ['güvenlik', 'uyum', 'kvkk', 'pii', 'soc2', 'cve', 'secret', 'waf', 'lisans denet', 'denetim kanıt', 'yama'],
  pazarlama: ['pazarlama', 'seo', 'kampanya', 'reklam', 'roas', 'influencer', 'rakip fiyat', 'rakip ürün', 'sosyal medya', 'plausible'],
  destek: ['müşteri destek', 'destek', 'bilet', 'çağrı', 'randevu', 'yorum', 'l1', 'ticket', 'geri bildirim', 'fhir', 'garanti'],
  'satin-alma': ['satın alma', 'tedarikçi', 'ihale', 'şartname', 'teklif karşılaştır', 'sla', 'fiyat liste'],
  yonetim: ['yönetim', 'executive', 'yatırımcı', 'bütçe', 'karbon', 'seyahat koordinatör'],
  'e-ticaret': [
    'e-ticaret', 'perakende', 'mağaza', 'sepet', 'iade', 'picking', 'stok', 'katalog', 'rakip fiyat',
    'cross-sell', 'cart', 'marketplace', 'sahtekarlık', 'ürün iade', 'mağaza ziyaret',
  ],
  insaat: ['inşaat', 'şantiye', 'saha', 'masraf', 'proje', 'hakediş', 'taşeron', 'whatsapp masraf'],
  'tedarik-zinciri': [
    'lojistik', 'konteyner', 'sevkiyat', 'navlun', 'depo', 'kargo', 'gemi', 'tedarik zinciri', 'gtip', 'ihracat',
  ],
  'saglik-klinik': ['sağlık', 'klinik', 'hasta', 'fhir', 'randevu teyit', 'medikal', 'tıbbi', 'hastane'],
};

function haystack(entry: McpIntegration): string {
  return [entry.name, entry.description, entry.about, entry.category, ...entry.features].join(' ').toLowerCase();
}

function scoreForDepartment(entry: McpIntegration, department: DepartmentSlug): number {
  const categoryMatch = CATEGORY_DEPARTMENT[entry.category];
  let score = categoryMatch === department ? 12 : 0;

  if (entry.category === 'Muhasebe & Finans') {
    if (department === 'muhasebe' || department === 'finans') {
      score += 4;
    }
  }

  const text = haystack(entry);
  score += DEPARTMENT_KEYWORDS[department].reduce(
    (sum, keyword) => sum + (text.includes(keyword) ? 1 : 0),
    0
  );

  score += SLUG_DEPARTMENT_BOOSTS[entry.id]?.[department] ?? 0;

  return score;
}

export function listMcpServers(): McpIntegration[] {
  return listMcpIntegrations();
}

export function getMcpServerById(id: string): McpIntegration | undefined {
  return listMcpIntegrations().find((entry) => entry.id === id);
}

export function listMcpServersForDepartment(department: DepartmentSlug): McpIntegration[] {
  const scored = listMcpIntegrations()
    .map((entry) => ({ entry, score: scoreForDepartment(entry, department) }))
    .filter((item) => item.score > 0);

  if (scored.length === 0) {
    return [];
  }

  scored.sort((a, b) => b.score - a.score || a.entry.name.localeCompare(b.entry.name, 'tr'));
  return scored.map((item) => item.entry);
}

export function searchMcpServers(query: string): McpIntegration[] {
  const needle = query.trim().toLocaleLowerCase('tr');
  if (!needle) return listMcpIntegrations();
  return listMcpIntegrations().filter((entry) => haystack(entry).includes(needle));
}

export function getFeaturedMcpServers(limit = 8): McpIntegration[] {
  return listMcpIntegrations().slice(0, limit);
}

export function listMcpDepartmentsWithServers(): DepartmentSlug[] {
  return DEPARTMENT_SLUGS.filter((department) => listMcpServersForDepartment(department).length > 0);
}
