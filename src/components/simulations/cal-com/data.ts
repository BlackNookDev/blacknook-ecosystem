export type SimView =
  | 'booking'
  | 'events'
  | 'availability'
  | 'workflows'
  | 'integrations'
  | 'team'
  | 'payments'
  | 'embed';

export type DurationOption = '15m' | '30m' | '45m' | '60m';

export type LocationType = 'cal-video' | 'google-meet' | 'phone' | 'in-person';

export type CalEventType = {
  id: string;
  title: string;
  slug: string;
  description: string;
  durations: DurationOption[];
  location: LocationType;
  price?: string;
  requiresConfirmation: boolean;
  recurring?: boolean;
  roundRobin?: boolean;
};

export const HOST = {
  name: 'Blacknook Ekibi',
  username: 'blacknook',
  title: 'Partnerships & Collaborations',
  bio: 'Ajans, SaaS girişimi veya işletme olarak Cal ile iş birliği mi arıyorsunuz? Konuşalım!',
  timezone: 'Europe/Istanbul',
  timezoneLabel: 'İstanbul (GMT+3)',
};

export const DURATION_LABELS: Record<DurationOption, string> = {
  '15m': '15 dk',
  '30m': '30 dk',
  '45m': '45 dk',
  '60m': '1 sa',
};

export const LOCATION_LABELS: Record<LocationType, string> = {
  'cal-video': 'Cal Video',
  'google-meet': 'Google Meet',
  phone: 'Telefon görüşmesi',
  'in-person': 'Yüz yüze',
};

export const EVENT_TYPES: CalEventType[] = [
  {
    id: 'partnerships',
    title: 'Partnerships Meeting',
    slug: 'partnerships',
    description: HOST.bio,
    durations: ['15m', '30m', '45m', '60m'],
    location: 'cal-video',
    requiresConfirmation: false,
  },
  {
    id: 'discovery',
    title: 'Keşif görüşmesi',
    slug: 'discovery',
    description: 'İhtiyaç analizi, ürün uyumu ve sonraki adımlar.',
    durations: ['30m', '45m'],
    location: 'google-meet',
    requiresConfirmation: true,
  },
  {
    id: 'demo',
    title: 'Ürün demosu',
    slug: 'demo',
    description: 'Canlı ürün turu, entegrasyon soruları ve Q&A.',
    durations: ['45m', '60m'],
    location: 'cal-video',
    price: '₺0',
    requiresConfirmation: false,
  },
  {
    id: 'support',
    title: 'Destek oturumu',
    slug: 'support',
    description: 'Kurulum, teknik destek ve danışmanlık.',
    durations: ['15m', '30m'],
    location: 'phone',
    requiresConfirmation: false,
    roundRobin: true,
  },
  {
    id: 'collective',
    title: 'Kolektif ekip toplantısı',
    slug: 'collective',
    description: 'Birden fazla katılımcıyla ortak müsaitlik.',
    durations: ['30m', '60m'],
    location: 'cal-video',
    requiresConfirmation: true,
    recurring: true,
  },
  {
    id: 'instant',
    title: 'Anlık toplantı',
    slug: 'instant',
    description: 'Hemen başlayan kısa görüşme bağlantısı.',
    durations: ['15m'],
    location: 'cal-video',
    requiresConfirmation: false,
  },
];

export const WEEK_DAYS = [
  { key: 'mon', label: 'Pzt', date: '8', full: 'Pazartesi 8' },
  { key: 'tue', label: 'Sal', date: '9', full: 'Salı 9' },
  { key: 'wed', label: 'Çar', date: '10', full: 'Çarşamba 10' },
  { key: 'thu', label: 'Per', date: '11', full: 'Perşembe 11' },
  { key: 'fri', label: 'Cum', date: '12', full: 'Cuma 12' },
] as const;

export const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00', '17:00'] as const;

export const BOOKED_SLOTS = new Set(['mon-10:30', 'wed-14:00', 'fri-09:00', 'tue-15:00']);

export const AVAILABILITY_SCHEDULE = [
  { day: 'Pazartesi', start: '08:30', end: '17:00', active: true },
  { day: 'Salı', start: '09:00', end: '18:30', active: true },
  { day: 'Çarşamba', start: '10:00', end: '19:00', active: true },
  { day: 'Perşembe', start: '09:00', end: '17:00', active: true },
  { day: 'Cuma', start: '09:00', end: '16:00', active: true },
  { day: 'Cumartesi', start: '—', end: '—', active: false },
  { day: 'Pazar', start: '—', end: '—', active: false },
];

export const BUFFER_SETTINGS = {
  minimumNotice: '4 saat',
  bufferBefore: '30 dk',
  bufferAfter: '30 dk',
  slotInterval: 'Etkinlik süresi (varsayılan)',
  dailyLimit: '6 toplantı',
  weeklyLimit: '25 toplantı',
};

export const WORKFLOW_TEMPLATES = [
  {
    id: 'reminder-15',
    title: 'Toplantı hatırlatıcısı',
    trigger: 'Etkinlikten 15 dk önce',
    channel: 'E-posta + SMS',
    active: true,
  },
  {
    id: 'confirm',
    title: 'Rezervasyon onayı',
    trigger: 'Yeni rezervasyon',
    channel: 'E-posta',
    active: true,
  },
  {
    id: 'followup',
    title: 'Ön bilgi formu',
    trigger: 'Rezervasyondan 1 gün önce',
    channel: 'E-posta',
    active: true,
  },
  {
    id: 'reschedule',
    title: 'Yeniden planlama bildirimi',
    trigger: 'Rezervasyon değişti',
    channel: 'E-posta + takvim',
    active: true,
  },
];

export const NOTIFICATION_FEED = [
  {
    id: '1',
    title: 'Yeni rezervasyon onaylandı',
    body: 'James Oliver sizinle 30 dk keşif görüşmesi ayarladı.',
    time: 'Az önce',
    type: 'booking' as const,
  },
  {
    id: '2',
    title: 'Toplantı 15 dk içinde başlıyor',
    body: 'Partnerships Meeting · Cal Video',
    time: '15 dk',
    type: 'reminder' as const,
  },
  {
    id: '3',
    title: 'Rezervasyon yeniden planlandı',
    body: 'Melissa Smith toplantıyı Çar 25 Mar 15:00 olarak güncelledi.',
    time: '30 dk önce',
    type: 'reschedule' as const,
  },
];

export const INTEGRATIONS = [
  { id: 'google', name: 'Google Calendar', category: 'Takvim', connected: true, desc: 'Çift yönlü senkron, çakışma önleme' },
  { id: 'outlook', name: 'Outlook / Office 365', category: 'Takvim', connected: true, desc: 'Microsoft takvim entegrasyonu' },
  { id: 'stripe', name: 'Stripe', category: 'Ödeme', connected: true, desc: 'Rezervasyonlarda ücret tahsilatı' },
  { id: 'slack', name: 'Slack', category: 'İletişim', connected: true, desc: 'Yeni rezervasyon bildirimleri' },
  { id: 'zoom', name: 'Zoom', category: 'Video', connected: false, desc: 'Zoom toplantı linki oluşturma' },
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', connected: false, desc: 'Her rezervasyonda CRM güncelleme' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', connected: false, desc: 'Lead ve pipeline senkronu' },
  { id: 'zapier', name: 'Zapier', category: 'Otomasyon', connected: false, desc: '1000+ uygulama bağlantısı' },
  { id: 'webhooks', name: 'Webhooks', category: 'Geliştirici', connected: true, desc: 'Olay bazlı HTTP bildirimleri' },
  { id: 'caldav', name: 'CalDAV', category: 'Takvim', connected: false, desc: 'Açık takvim protokolü' },
];

export const TEAM_MEMBERS = [
  { id: '1', name: 'Ayşe K.', role: 'Satış', roundRobin: true, events: 12 },
  { id: '2', name: 'Mehmet R.', role: 'Destek', roundRobin: true, events: 8 },
  { id: '3', name: 'Selin T.', role: 'Partnerships', roundRobin: false, events: 5 },
];

export const OOO_PERIODS = [
  { id: '1', label: 'Yaz tatili', range: '12–26 Ağu 2026', active: false },
  { id: '2', label: 'Konferans haftası', range: '3–7 Kas 2026', active: true },
];

export const PAYMENT_SETTINGS = {
  currency: 'TRY',
  stripeConnected: true,
  requirePayment: false,
  defaultPrice: 'Ücretsiz',
  collectedThisMonth: '₺0',
};

export const EMBED_SNIPPET = `<script src="https://cal.com/embed.js" async></script>
<cal-inline link="blacknook/discovery"></cal-inline>`;

export const FEATURE_HIGHLIGHTS = [
  { title: 'Cal Video', desc: 'Yerleşik video konferans' },
  { title: 'Kısa link', desc: 'cal/blacknook' },
  { title: 'Embed', desc: 'Web sitesine gömme' },
  { title: '65+ dil', desc: 'Çok dilli arayüz' },
  { title: 'Gizlilik', desc: 'SOC 2, şifreli depolama' },
  { title: 'Self-host', desc: 'Kendi sunucunuzda kurulum' },
];

export const SIM_NAV: { id: SimView; label: string }[] = [
  { id: 'booking', label: 'Rezervasyon' },
  { id: 'events', label: 'Etkinlikler' },
  { id: 'availability', label: 'Müsaitlik' },
  { id: 'workflows', label: 'Workflows' },
  { id: 'integrations', label: 'App Store' },
  { id: 'team', label: 'Ekip' },
  { id: 'payments', label: 'Ödemeler' },
  { id: 'embed', label: 'Embed' },
];
