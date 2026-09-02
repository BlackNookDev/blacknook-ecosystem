export type NookPricingPlan = {
  id: string;
  name: string;
  target: string;
  setupFee: number;
  monthlyFee: number;
  annualFee: number;
  popular?: boolean;
  badge?: string;
  features: string[];
};

export const NOOK_MCP_PRICING_PLANS: NookPricingPlan[] = [
  {
    id: 'starter',
    name: 'Başlangıç Paketi',
    target: '1-2 Aktif Şantiyesi Olan Butik Firmalar',
    setupFee: 60000,
    monthlyFee: 10000,
    annualFee: 100000,
    features: [
      '1-2 Aktif Şantiye Yönetimi',
      '5 Kullanıcı Yetkilendirme',
      'AI Destekli Şantiye Maliyet & Kasa Takibi',
      'Gelir / Gider ve Temel Raporlama',
      'Standart Destek & Sistem Bakımı',
      'Tek Seferlik Kurulum ve Personel Eğitimi Dahil',
    ],
  },
  {
    id: 'growth',
    name: 'Büyüme Paketi',
    target: '3-6 Aktif Şantiyesi Olan Müteahhitlik Firmaları',
    setupFee: 95000,
    monthlyFee: 18000,
    annualFee: 180000,
    popular: true,
    badge: 'En Çok Tercih Edilen',
    features: [
      '3-6 Aktif Şantiye Yönetimi',
      '15 Kullanıcı Yetkilendirme',
      'Taşeron & Hakediş Takip Modülü',
      'AI Fiş/Fatura OCR ve Otomatik İşleme',
      'WhatsApp Entegrasyonlu Masraf Girişi',
      'Öncelikli Telefon & WhatsApp Destek Hattı',
      'Geçmiş Veri Aktarımı ve Özel Şablon Kurulumu',
    ],
  },
  {
    id: 'enterprise',
    name: 'Kurumsal Paket',
    target: 'Çoklu Proje Yürüten Büyük İnşaat Şirketleri',
    setupFee: 175000,
    monthlyFee: 32000,
    annualFee: 320000,
    features: [
      'Sınırsız Şantiye ve Proje',
      'Sınırsız Kullanıcı',
      'Mevcut ERP / Muhasebe Sistemi Entegrasyonu',
      'Şirkete Özel Eğitilmiş AI / MCP Asistanı',
      'Nakit Akışı, Çek/Senet & Bütçe Tahminleme Modülü',
      '7/24 Özel Müşteri Temsilcisi ve SLA Garantisi',
      'Yerinde Eğitim, Özel Onboarding ve Düzenli Raporlama',
    ],
  },
];

export function formatTry(amount: number): string {
  return `₺${amount.toLocaleString('tr-TR')}`;
}

export const NOOK_MCP_SERVICE_SLUG = 'nook-muhasebe-mcp';
