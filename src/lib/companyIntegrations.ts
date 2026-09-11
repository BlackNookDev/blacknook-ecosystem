export type IntegrationStatus =
  | 'connected'
  | 'pending_it'
  | 'action_required'
  | 'disconnected';

/** OAuth / tek tık kurumsal uygulamalar + özel kanallar */
export type IntegrationProvider = string;

export type CorporateAppCategory =
  | 'isbirligi'
  | 'crm-destek'
  | 'ik-isealim'
  | 'finans-erp'
  | 'pazarlama'
  | 'gelistirme-it'
  | 'belge-depolama';

export type CorporateAppMeta = {
  id: IntegrationProvider;
  name: string;
  blurb: string;
  cta: string;
  category: CorporateAppCategory;
  /** simpleicons slug (logo) */
  icon: string;
  brandColor: string;
};

export type CompanyIntegration = {
  id: string;
  companyId: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  assignedDepartments: string[];
  authMetadata: Record<string, unknown>;
  lastSyncAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export const CATEGORY_LABELS: Record<CorporateAppCategory, string> = {
  isbirligi: 'İş birliği',
  'crm-destek': 'CRM & destek',
  'ik-isealim': 'İK & işe alım',
  'finans-erp': 'Finans & ERP',
  pazarlama: 'Pazarlama',
  'gelistirme-it': 'Geliştirme & IT',
  'belge-depolama': 'Belge & depolama',
};

/**
 * Okta Businesses at Work + Fortune 500 yaygın stack + TR ERP.
 * Bölüm A: tek tıkla yetkilendirilen ~50 kurumsal uygulama.
 */
export const CORPORATE_APPS: CorporateAppMeta[] = [
  // İş birliği
  {
    id: 'google',
    name: 'Google Workspace',
    blurb: 'Gmail, Takvim ve Drive erişimi.',
    cta: 'Bağla',
    category: 'isbirligi',
    icon: 'google',
    brandColor: '4285F4',
  },
  {
    id: 'microsoft',
    name: 'Microsoft 365',
    blurb: 'Outlook, Teams ve OneDrive.',
    cta: 'Bağla',
    category: 'isbirligi',
    icon: 'microsoft',
    brandColor: '00A4EF',
  },
  {
    id: 'slack',
    name: 'Slack',
    blurb: 'Kanallar ve ajan bildirimleri.',
    cta: 'Bağla',
    category: 'isbirligi',
    icon: 'slack',
    brandColor: '4A154B',
  },
  {
    id: 'zoom',
    name: 'Zoom',
    blurb: 'Toplantı ve kayıt erişimi.',
    cta: 'Bağla',
    category: 'isbirligi',
    icon: 'zoom',
    brandColor: '0B5CFF',
  },
  {
    id: 'notion',
    name: 'Notion',
    blurb: 'Wiki ve görev panoları.',
    cta: 'Bağla',
    category: 'isbirligi',
    icon: 'notion',
    brandColor: 'FFFFFF',
  },
  {
    id: 'asana',
    name: 'Asana',
    blurb: 'Proje ve görev takibi.',
    cta: 'Bağla',
    category: 'isbirligi',
    icon: 'asana',
    brandColor: 'F06A6A',
  },
  {
    id: 'monday',
    name: 'monday.com',
    blurb: 'İş panoları ve iş akışları.',
    cta: 'Bağla',
    category: 'isbirligi',
    icon: 'monday',
    brandColor: 'FF3D57',
  },
  {
    id: 'clickup',
    name: 'ClickUp',
    blurb: 'Görev ve doküman merkezi.',
    cta: 'Bağla',
    category: 'isbirligi',
    icon: 'clickup',
    brandColor: '7B68EE',
  },
  {
    id: 'trello',
    name: 'Trello',
    blurb: 'Kart tabanlı iş listeleri.',
    cta: 'Bağla',
    category: 'isbirligi',
    icon: 'trello',
    brandColor: '0052CC',
  },
  {
    id: 'miro',
    name: 'Miro',
    blurb: 'Beyaz tahta ve atölye panoları.',
    cta: 'Bağla',
    category: 'isbirligi',
    icon: 'miro',
    brandColor: 'FFD02F',
  },

  // CRM & destek
  {
    id: 'salesforce',
    name: 'Salesforce',
    blurb: 'CRM, fırsat ve hesap verisi.',
    cta: 'Bağla',
    category: 'crm-destek',
    icon: 'salesforce',
    brandColor: '00A1E0',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    blurb: 'CRM, pipeline ve pazarlama.',
    cta: 'Bağla',
    category: 'crm-destek',
    icon: 'hubspot',
    brandColor: 'FF7A59',
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    blurb: 'Satış hunisi ve aktivite.',
    cta: 'Bağla',
    category: 'crm-destek',
    icon: 'pipedrive',
    brandColor: '017737',
  },
  {
    id: 'zendesk',
    name: 'Zendesk',
    blurb: 'Destek biletleri ve bilgilendirme.',
    cta: 'Bağla',
    category: 'crm-destek',
    icon: 'zendesk',
    brandColor: '03363D',
  },
  {
    id: 'intercom',
    name: 'Intercom',
    blurb: 'Canlı sohbet ve müşteri mesajları.',
    cta: 'Bağla',
    category: 'crm-destek',
    icon: 'intercom',
    brandColor: '6AFDEF',
  },
  {
    id: 'freshdesk',
    name: 'Freshdesk',
    blurb: 'Çok kanallı destek masası.',
    cta: 'Bağla',
    category: 'crm-destek',
    icon: 'freshdesk',
    brandColor: '25C16F',
  },
  {
    id: 'servicenow',
    name: 'ServiceNow',
    blurb: 'ITSM ve hizmet talepleri.',
    cta: 'Bağla',
    category: 'crm-destek',
    icon: 'servicenow',
    brandColor: '81B5A1',
  },
  {
    id: 'dynamics365',
    name: 'Dynamics 365',
    blurb: 'Microsoft CRM ve satış.',
    cta: 'Bağla',
    category: 'crm-destek',
    icon: 'microsoftdynamics365',
    brandColor: '002050',
  },

  // İK
  {
    id: 'workday',
    name: 'Workday',
    blurb: 'İK, bordro ve iş gücü.',
    cta: 'Bağla',
    category: 'ik-isealim',
    icon: 'workday',
    brandColor: 'F68D2E',
  },
  {
    id: 'bamboohr',
    name: 'BambooHR',
    blurb: 'Personel ve izin süreçleri.',
    cta: 'Bağla',
    category: 'ik-isealim',
    icon: 'bamboohr',
    brandColor: '73C41D',
  },
  {
    id: 'personio',
    name: 'Personio',
    blurb: 'İK yönetimi ve işe alım.',
    cta: 'Bağla',
    category: 'ik-isealim',
    icon: 'personio',
    brandColor: '000000',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    blurb: 'Aday ve şirket ağ verisi.',
    cta: 'Bağla',
    category: 'ik-isealim',
    icon: 'linkedin',
    brandColor: '0A66C2',
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    blurb: 'İşe alım ve aday hunisi.',
    cta: 'Bağla',
    category: 'ik-isealim',
    icon: 'greenhouse',
    brandColor: '24A47F',
  },

  // Finans & ERP
  {
    id: 'sap',
    name: 'SAP',
    blurb: 'Kurumsal ERP ve finans.',
    cta: 'Bağla',
    category: 'finans-erp',
    icon: 'sap',
    brandColor: '0FAAFF',
  },
  {
    id: 'netsuite',
    name: 'Oracle NetSuite',
    blurb: 'Bulut ERP ve muhasebe.',
    cta: 'Bağla',
    category: 'finans-erp',
    icon: 'oracle',
    brandColor: 'F80000',
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    blurb: 'Muhasebe ve faturalama.',
    cta: 'Bağla',
    category: 'finans-erp',
    icon: 'quickbooks',
    brandColor: '2CA01C',
  },
  {
    id: 'xero',
    name: 'Xero',
    blurb: 'Bulut muhasebe defteri.',
    cta: 'Bağla',
    category: 'finans-erp',
    icon: 'xero',
    brandColor: '13B5EA',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    blurb: 'Ödeme ve tahsilat verisi.',
    cta: 'Bağla',
    category: 'finans-erp',
    icon: 'stripe',
    brandColor: '635BFF',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    blurb: 'Ödeme ve cüzdan işlemleri.',
    cta: 'Bağla',
    category: 'finans-erp',
    icon: 'paypal',
    brandColor: '00457C',
  },
  {
    id: 'concur',
    name: 'SAP Concur',
    blurb: 'Seyahat ve masraf onayı.',
    cta: 'Bağla',
    category: 'finans-erp',
    icon: 'sap',
    brandColor: '0FAAFF',
  },
  {
    id: 'expensify',
    name: 'Expensify',
    blurb: 'Masraf fişi ve raporlama.',
    cta: 'Bağla',
    category: 'finans-erp',
    icon: 'expensify',
    brandColor: '018301',
  },
  {
    id: 'logo_erp',
    name: 'Logo ERP',
    blurb: 'Tiger / Go3 muhasebe.',
    cta: 'Bağla',
    category: 'finans-erp',
    icon: 'l',
    brandColor: 'E30613',
  },
  {
    id: 'parasut',
    name: 'Paraşüt',
    blurb: 'Ön muhasebe ve e-fatura.',
    cta: 'Bağla',
    category: 'finans-erp',
    icon: 'p',
    brandColor: '00B4A0',
  },

  // Pazarlama
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    blurb: 'E-posta kampanyaları.',
    cta: 'Bağla',
    category: 'pazarlama',
    icon: 'mailchimp',
    brandColor: 'FFE01B',
  },
  {
    id: 'klaviyo',
    name: 'Klaviyo',
    blurb: 'E-ticaret pazarlama otomasyonu.',
    cta: 'Bağla',
    category: 'pazarlama',
    icon: 'klaviyo',
    brandColor: '000000',
  },
  {
    id: 'meta_business',
    name: 'Meta Business',
    blurb: 'Facebook / Instagram reklamları.',
    cta: 'Bağla',
    category: 'pazarlama',
    icon: 'meta',
    brandColor: '0668E1',
  },
  {
    id: 'google_ads',
    name: 'Google Ads',
    blurb: 'Arama ve display kampanyaları.',
    cta: 'Bağla',
    category: 'pazarlama',
    icon: 'googleads',
    brandColor: '4285F4',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    blurb: 'Mağaza, sipariş ve stok.',
    cta: 'Bağla',
    category: 'pazarlama',
    icon: 'shopify',
    brandColor: '7AB55C',
  },
  {
    id: 'calendly',
    name: 'Calendly',
    blurb: 'Randevu ve slot paylaşımı.',
    cta: 'Bağla',
    category: 'pazarlama',
    icon: 'calendly',
    brandColor: '006BFF',
  },

  // Geliştirme & IT
  {
    id: 'github',
    name: 'GitHub',
    blurb: 'Kod deposu ve PR akışı.',
    cta: 'Bağla',
    category: 'gelistirme-it',
    icon: 'github',
    brandColor: 'FFFFFF',
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    blurb: 'CI/CD ve proje yönetimi.',
    cta: 'Bağla',
    category: 'gelistirme-it',
    icon: 'gitlab',
    brandColor: 'FC6D26',
  },
  {
    id: 'jira',
    name: 'Jira',
    blurb: 'İş kalemi ve sprint takibi.',
    cta: 'Bağla',
    category: 'gelistirme-it',
    icon: 'jira',
    brandColor: '0052CC',
  },
  {
    id: 'confluence',
    name: 'Confluence',
    blurb: 'Teknik dokümantasyon.',
    cta: 'Bağla',
    category: 'gelistirme-it',
    icon: 'confluence',
    brandColor: '172B4D',
  },
  {
    id: 'aws',
    name: 'Amazon AWS',
    blurb: 'Bulut hesap ve kaynaklar.',
    cta: 'Bağla',
    category: 'gelistirme-it',
    icon: 'amazonaws',
    brandColor: 'FF9900',
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    blurb: 'Bulut abonelik ve kaynaklar.',
    cta: 'Bağla',
    category: 'gelistirme-it',
    icon: 'microsoftazure',
    brandColor: '0078D4',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    blurb: 'DNS, CDN ve güvenlik.',
    cta: 'Bağla',
    category: 'gelistirme-it',
    icon: 'cloudflare',
    brandColor: 'F38020',
  },

  // Belge & depolama
  {
    id: 'dropbox',
    name: 'Dropbox',
    blurb: 'Dosya depolama ve paylaşım.',
    cta: 'Bağla',
    category: 'belge-depolama',
    icon: 'dropbox',
    brandColor: '0061FF',
  },
  {
    id: 'box',
    name: 'Box',
    blurb: 'Kurumsal içerik yönetimi.',
    cta: 'Bağla',
    category: 'belge-depolama',
    icon: 'box',
    brandColor: '0061D5',
  },
  {
    id: 'docusign',
    name: 'DocuSign',
    blurb: 'Elektronik imza süreçleri.',
    cta: 'Bağla',
    category: 'belge-depolama',
    icon: 'docusign',
    brandColor: 'FFD700',
  },
  {
    id: 'figma',
    name: 'Figma',
    blurb: 'Tasarım dosyaları ve yorumlar.',
    cta: 'Bağla',
    category: 'belge-depolama',
    icon: 'figma',
    brandColor: 'F24E1E',
  },
];

export const OAUTH_PROVIDERS: IntegrationProvider[] = CORPORATE_APPS.map((app) => app.id);

export const PROVIDER_META: Record<string, { name: string; blurb: string; cta: string }> =
  Object.fromEntries(
    [
      ...CORPORATE_APPS.map((app) => [app.id, { name: app.name, blurb: app.blurb, cta: app.cta }] as const),
      [
        'whatsapp',
        {
          name: 'WhatsApp Saha Hattı',
          blurb: 'Saha masraf ve fiş mesajlarını Muhasebe Ajanı’na yönlendirir.',
          cta: 'Hattı eşleştir',
        },
      ],
      [
        'custom_it',
        {
          name: 'IT / Teknik Kurulum',
          blurb: 'Logo ERP, veritabanı veya yerel ağ için IT sorumlusuna yetki devri.',
          cta: 'Kurulum Sihirbazı Gönder',
        },
      ],
    ]
  );

export const DEPARTMENT_LABELS: Record<string, string> = {
  muhasebe: 'Muhasebe Ajanı',
  finans: 'Finans Ajanı',
  satis: 'Satış Ajanı',
  destek: 'Destek Ajanı',
  operasyon: 'Operasyon Ajanı',
  ik: 'İK Ajanı',
  pazarlama: 'Pazarlama Ajanı',
  teknoloji: 'Teknoloji Ajanı',
};

const DEFAULT_DEPTS_BY_CATEGORY: Record<CorporateAppCategory, string[]> = {
  isbirligi: ['operasyon', 'destek'],
  'crm-destek': ['satis', 'destek'],
  'ik-isealim': ['ik'],
  'finans-erp': ['muhasebe', 'finans'],
  pazarlama: ['pazarlama', 'satis'],
  'gelistirme-it': ['teknoloji'],
  'belge-depolama': ['operasyon'],
};

export const PROVIDER_DEFAULT_DEPARTMENTS: Record<string, string[]> = {
  ...Object.fromEntries(
    CORPORATE_APPS.map((app) => [app.id, DEFAULT_DEPTS_BY_CATEGORY[app.category]])
  ),
  whatsapp: ['muhasebe', 'destek'],
  custom_it: ['muhasebe', 'finans', 'teknoloji'],
};

export function getCorporateApp(id: string): CorporateAppMeta | undefined {
  return CORPORATE_APPS.find((app) => app.id === id);
}

export function companyIdForUser(userId: number): string {
  return `user-${userId}`;
}

export function statusLabel(status: IntegrationStatus): string {
  switch (status) {
    case 'connected':
      return 'Aktif';
    case 'pending_it':
      return 'IT bekleniyor';
    case 'action_required':
      return 'İşlem gerekli';
    default:
      return 'Bağlı değil';
  }
}

export function departmentChipLabel(slug: string): string {
  return DEPARTMENT_LABELS[slug] || slug;
}

export function generatePairingCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function generateInviteToken(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Mock tohum: Google bağlı; katalogdaki diğer uygulamalar kopuk + WhatsApp. */
export function buildSeedIntegrations(companyId: string): Omit<
  CompanyIntegration,
  'id' | 'createdAt' | 'updatedAt'
>[] {
  const now = new Date().toISOString();
  const apps: Omit<CompanyIntegration, 'id' | 'createdAt' | 'updatedAt'>[] = CORPORATE_APPS.map(
    (app) => ({
      companyId,
      provider: app.id,
      status: (app.id === 'google' ? 'connected' : 'disconnected') as IntegrationStatus,
      assignedDepartments: PROVIDER_DEFAULT_DEPARTMENTS[app.id] || [],
      authMetadata: { mock: true },
      lastSyncAt: app.id === 'google' ? now : null,
    })
  );

  apps.push({
    companyId,
    provider: 'whatsapp',
    status: 'disconnected',
    assignedDepartments: PROVIDER_DEFAULT_DEPARTMENTS.whatsapp,
    authMetadata: {
      mock: true,
      pairingCode: generatePairingCode(),
      pairingExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    },
    lastSyncAt: null,
  });

  return apps;
}
