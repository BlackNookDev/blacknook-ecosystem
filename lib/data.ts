import {
  getMcpCatalogEntryBySlug,
  listMcpCatalogEntries,
  listMcpCatalogSlugs,
} from '@/lib/mcpCustomerCatalog';
import { HERO_AGENT_SLUGS, isHeroAgentSlug } from './heroAgents';

export interface ServiceCatalogItem {
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  features: string[];
  about: string;
  useCases: string[];
  listingType?: 'saas' | 'micro-saas' | 'service';
  demoUrl?: string;
  /** hero-agent = vitrin ajanı, mcp-agent = katalog ajanı */
  catalogKind?: 'hero-agent' | 'mcp-agent';
  /** enterprise = vitrin/SLA; standard = katalog (UI’da “deneysel” yazılmaz) */
  catalogTier?: 'enterprise' | 'standard';
  agentDepartment?: string;
}

export type ServiceCatalogEntry = ServiceCatalogItem & {
  brandColor: string;
  coverImage?: string;
  iconImage?: string;
  source?: 'catalog' | 'marketplace' | 'mcp';
  listingType?: 'saas' | 'micro-saas' | 'service';
  verified?: boolean;
  vendorName?: string;
};

/** Platform vitrinindeki ana MCP ajanları */
export const HERO_AGENTS: ServiceCatalogEntry[] = [
  {
    slug: 'nook-muhasebe-mcp',
    name: 'NOOK Muhasebe Ajanı',
    description:
      'Şantiye WhatsApp masraflarını Logo Tiger ve Mikro ERP taslak fişine dönüştüren otonom muhasebe ajanı.',
    icon: 'nook-muhasebe-mcp',
    listingType: 'service',
    catalogKind: 'hero-agent',
    agentDepartment: 'Muhasebe',
    category: 'Muhasebe & Finans',
    brandColor: '#14B8A6',
    demoUrl: '/service/nook-muhasebe-mcp/simulasyon',
    features: [
      'WhatsApp üzerinden şantiye masraf girişi',
      'Logo Tiger / Mikro ERP taslak fiş entegrasyonu',
      'Yönetici onay akışı ve WhatsApp özeti',
      'Vade ve çek ödeme uyarıları',
      'Proje ve tedarikçi bazlı masraf takibi',
    ],
    about:
      'NOOK Muhasebe Ajanı, saha ekiplerinin WhatsApp üzerinden ilettiği masrafları yapay zeka ile ayrıştırır; cari, KDV ve proje bilgilerini Logo Tiger veya Mikro ERP taslak fişlerine dönüştürür. Yöneticiler tek ekrandan onaylar, vade risklerini görür ve günlük özetleri WhatsApp’tan alır.',
    useCases: [
      'Şantiye grubundan gelen fiş ve masraf mesajlarını ERP’ye aktarma',
      'Muhasebe ekibinin taslak fiş onay sürecini hızlandırma',
      'Yarın vadesi gelen çek ve ödemeler için erken uyarı',
    ],
  },
  {
    slug: 'metabase',
    name: 'Metabase BI Ajanı',
    description: 'Teknik olmayan ekipler için self-servis BI panoları üreten raporlama ajanı.',
    icon: 'metabase',
    catalogKind: 'hero-agent',
    agentDepartment: 'Finans',
    category: 'BI & Görselleştirme',
    brandColor: '#509EE3',
    demoUrl: '/service/metabase/simulasyon',
    features: [
      'Görsel sorgu oluşturucu ve yerel SQL',
      'Pano, filtre ve detaya inme',
      'E-posta ve Slack ile zamanlanmış raporlar',
      'Çoklu veritabanı bağlantısı',
      'Satır düzeyinde sandbox ve SSO',
    ],
    about:
      'Metabase BI Ajanı, şirket verilerini sorgulamak ve görselleştirmek için tasarlanmıştır. Ürün ve operasyon ekiplerinin SQL yazmadan metrik tüketmesini hedefler; MCP ile mevcut veri kaynaklarına bağlanır.',
    useCases: [
      'Satış ve pazarlama hunisi panoları',
      'Operasyonel KPI takibi',
      'Müşteriye gömülü analitik',
    ],
  },
  {
    slug: 'plausible',
    name: 'Plausible Analitik Ajanı',
    description: 'Çerezsiz, GDPR uyumlu web trafiğini ölçen analitik ajanı.',
    icon: 'plausibleanalytics',
    catalogKind: 'hero-agent',
    agentDepartment: 'Pazarlama',
    category: 'Analitik & Ürün',
    brandColor: '#5850EC',
    demoUrl: '/service/plausible/simulasyon',
    features: [
      'Çerez ve kişisel veri toplamadan ziyaret istatistikleri',
      'Hafif script ve hızlı yükleme',
      'Özel etkinlik ve hedef dönüşüm takibi',
      'E-posta/Slack haftalık raporlar',
      'Kendi sunucunuzda veya bulut seçeneği',
    ],
    about:
      'Plausible Analitik Ajanı, web sitelerinin trafiğini çerezsiz ve GDPR uyumlu şekilde ölçer. Pazarlama ekipleri için basit paneller ve şeffaf metodoloji sunar.',
    useCases: [
      'Kurumsal sitelerde çerez banner’ı olmadan trafik ölçümü',
      'Blog ve landing page performans takibi',
      'Ajansların çoklu site panelleri',
    ],
  },
  {
    slug: 'cal-com',
    name: 'Cal.com Randevu Ajanı',
    description: 'Satış ve destek ekipleri için randevu planlama ve slot yönetimi ajanı.',
    icon: 'caldotcom',
    listingType: 'service',
    catalogKind: 'hero-agent',
    agentDepartment: 'Satış',
    category: 'Planlama & Randevu',
    brandColor: '#292929',
    demoUrl: '/service/cal-com/simulasyon',
    features: [
      'Takvim entegrasyonları (Google, Outlook, CalDAV)',
      'Özelleştirilebilir randevu bağlantıları',
      'Ekip sıralı atama ve ortak etkinlikler',
      'Ödeme ve workflow otomasyonu',
      'API ve gömülü bileşen',
    ],
    about:
      'Cal.com Randevu Ajanı, toplantı slotlarını paylaşarak planlama sürtünmesini azaltır. Satış, destek ve danışmanlık görüşmelerini otomatik planlar.',
    useCases: [
      'Satış ve keşif görüşmesi randevuları',
      'Destek ve danışmanlık slot yönetimi',
      'Web sitesine gömülü rezervasyon formu',
    ],
  },
  {
    slug: 'chatwoot',
    name: 'Chatwoot Destek Ajanı',
    description: 'Çok kanallı müşteri konuşmalarını tek gelen kutusunda yöneten destek ajanı.',
    icon: 'chatwoot',
    listingType: 'service',
    catalogKind: 'hero-agent',
    agentDepartment: 'Destek',
    category: 'İletişim & Destek',
    brandColor: '#1F93FF',
    demoUrl: '/service/chatwoot/simulasyon',
    features: [
      'Web bileşeni, e-posta, WhatsApp ve Facebook kanalları',
      'Temsilci gelen kutusu, atama ve etiketler',
      'Hazır yanıtlar ve makrolar',
      'Yapay zeka destekli yanıt önerileri',
      'Kendi sunucunuzda veya bulut seçeneği',
    ],
    about:
      'Chatwoot Destek Ajanı, çok kanallı müşteri konuşmalarını tek panelde toplar. E-ticaret ve SaaS ekipleri için canlı sohbet, e-posta ve WhatsApp desteğini birleştirir.',
    useCases: [
      'E-ticaret canlı destek',
      'SaaS uygulama içi chat',
      'WhatsApp Business destek hattı',
    ],
  },
  {
    slug: 'outline',
    name: 'Outline Wiki Ajanı',
    description: 'Ekip wiki ve bilgi tabanını güncel tutan dokümantasyon ajanı.',
    icon: 'outline',
    catalogKind: 'hero-agent',
    agentDepartment: 'Operasyon',
    category: 'Dokümantasyon & Wiki',
    brandColor: '#000000',
    demoUrl: '/service/outline/simulasyon',
    features: [
      'Markdown tabanlı zengin doküman editörü',
      'Koleksiyon, izin ve paylaşım linkleri',
      'Slack ve Google ile SSO',
      'Tam metin arama',
      'Self-host ve bulut seçeneği',
    ],
    about:
      'Outline Wiki Ajanı, ekiplerin iç bilgisini düzenlemek ve güncel tutmak için tasarlanmıştır. Runbook, onboarding ve proje wiki süreçlerini destekler.',
    useCases: [
      'Mühendislik runbook ve standart işlem dokümantasyonu',
      'Onboarding bilgi merkezi',
      'Proje wiki ve karar kayıtları',
    ],
  },
  {
    slug: 'shopppro',
    name: 'Shopppro E-ticaret Ajanı',
    description:
      'Pazaryeri, stok, sipariş, kargo ve sosyal operasyonları tek panelde yürüten yapay zekâ e-ticaret MCP’si.',
    icon: 'shopppro',
    listingType: 'service',
    catalogKind: 'hero-agent',
    agentDepartment: 'E-ticaret',
    category: 'E-ticaret & Operasyon',
    brandColor: '#E11D2E',
    demoUrl: 'https://shopppro.io/tr',
    features: [
      'Amazon, Trendyol, Hepsiburada ve kendi mağaza senkronu',
      'YZ ile stok, fiyat ve katalog toplu işlemleri',
      'Kargo fiyat karşılaştırması ve gönderi yönetimi',
      'Sosyal içerik planlama ve otomatik yayın',
      'SEO, ödeme bağlantıları ve operasyon otomasyonları',
    ],
    about:
      'Shopppro, e-ticaret operasyonunu yapay zekâ asistanlarıyla yöneten bir MCP projesidir. Mağaza, pazaryerleri, sipariş, stok, kargo ve sosyal medya tek yerde birleşir; ekipler doğal dille katalog güncelleyip kanalları senkron tutar.',
    useCases: [
      'Çok kanallı ürün ve stok senkronizasyonu',
      'Kargo maliyeti optimizasyonu',
      'YZ ile toplu fiyat, içerik ve SEO güncellemeleri',
    ],
  },
];

/** @deprecated HERO_AGENTS kullanın */
export const SERVICES = HERO_AGENTS;

export type ServiceDealMeta = {
  price: number;
  originalPrice: number;
  reviews: number;
};

export function getServiceDealMeta(_slug: string, _index = 0): ServiceDealMeta {
  return {
    price: 0,
    originalPrice: 0,
    reviews: 0,
  };
}

export function asOfficialCatalog(service: ServiceCatalogEntry): ServiceCatalogEntry {
  const isHero = isHeroAgentSlug(service.slug);
  return {
    ...service,
    listingType: service.listingType || 'service',
    catalogKind: service.catalogKind || (isHero ? 'hero-agent' : 'mcp-agent'),
    catalogTier: service.catalogTier || (isHero ? 'enterprise' : 'standard'),
    verified: true,
    vendorName: 'Blacknook',
    source: service.source ?? (isHero ? 'catalog' : 'mcp'),
  };
}

export function getHeroAgents(): ServiceCatalogEntry[] {
  return HERO_AGENTS.map(asOfficialCatalog);
}

export function getFeaturedHeroAgents(limit = 6): ServiceCatalogEntry[] {
  return getHeroAgents().slice(0, limit);
}

export function getFeaturedMcpAgents(limit = 6): ServiceCatalogEntry[] {
  return listMcpCatalogEntries()
    .slice(0, limit)
    .map((entry) => asOfficialCatalog({ ...entry, catalogKind: 'mcp-agent', source: 'mcp' }));
}

/** @deprecated getFeaturedHeroAgents kullanın */
export function getFeaturedServices(limit = 12): ServiceCatalogEntry[] {
  return getHeroAgents().slice(0, limit);
}

export function getServiceBySlug(slug: string): ServiceCatalogEntry | undefined {
  const official = HERO_AGENTS.find((service) => service.slug === slug);
  if (official) return asOfficialCatalog(official);
  return getMcpCatalogEntryBySlug(slug);
}

export function getAllServiceSlugs(): string[] {
  return [...HERO_AGENTS.map((service) => service.slug), ...listMcpCatalogSlugs()];
}

export function getFullCatalog(): ServiceCatalogEntry[] {
  return [...getHeroAgents(), ...listMcpCatalogEntries().map(asOfficialCatalog)];
}
