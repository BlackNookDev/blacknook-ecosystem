export type ChatwootView = 'inbox' | 'reports' | 'macros';

export type Channel = 'web' | 'whatsapp' | 'email';

export type ConversationStatus = 'open' | 'pending' | 'resolved';

export type Message = {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  name: string;
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  customer: string;
  company?: string;
  channel: Channel;
  status: ConversationStatus;
  preview: string;
  time: string;
  unread: boolean;
  assignee?: string;
  labels: string[];
  messages: Message[];
};

export const CW_NAV: { id: ChatwootView; label: string }[] = [
  { id: 'inbox', label: 'Gelen kutusu' },
  { id: 'reports', label: 'Raporlar' },
  { id: 'macros', label: 'Makrolar' },
];

export const INBOX_FILTERS = ['Tümü', 'Bana atanan', 'Atanmamış', 'Açık'] as const;

export const CHANNEL_META: Record<Channel, { label: string; color: string }> = {
  web: { label: 'Web chat', color: '#1F93FF' },
  whatsapp: { label: 'WhatsApp', color: '#25D366' },
  email: { label: 'E-posta', color: '#6366F1' },
};

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    customer: 'Ayşe Yılmaz',
    company: 'Nova İnşaat',
    channel: 'whatsapp',
    status: 'open',
    preview: 'Sipariş #4821 hâlâ kargoya verilmedi, acil lazım.',
    time: '2 dk',
    unread: true,
    assignee: 'Siz',
    labels: ['acil', 'kargo'],
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        name: 'Ayşe Yılmaz',
        text: 'Merhaba, dün verdiğimiz #4821 numaralı sipariş hâlâ kargoya verilmedi. Şantiyede bekliyoruz.',
        time: '14:02',
      },
      {
        id: 'm2',
        sender: 'system',
        name: 'Sistem',
        text: 'Konuşma WhatsApp Business kanalından açıldı.',
        time: '14:02',
      },
      {
        id: 'm3',
        sender: 'customer',
        name: 'Ayşe Yılmaz',
        text: 'Sipariş #4821 hâlâ kargoya verilmedi, acil lazım.',
        time: '14:08',
      },
    ],
  },
  {
    id: 'c2',
    customer: 'Mehmet Kaya',
    company: 'TechScale SaaS',
    channel: 'web',
    status: 'open',
    preview: 'API anahtarı nereden alınır?',
    time: '18 dk',
    unread: false,
    labels: ['teknik'],
    messages: [
      {
        id: 'm4',
        sender: 'customer',
        name: 'Mehmet Kaya',
        text: 'Merhaba, MCP entegrasyonu için API anahtarını panelden nereden oluşturabilirim?',
        time: '13:50',
      },
    ],
  },
  {
    id: 'c3',
    customer: 'Zeynep Arslan',
    channel: 'email',
    status: 'pending',
    preview: 'Fatura PDF ekte — KDV oranı yanlış görünüyor.',
    time: '1 sa',
    unread: false,
    assignee: 'Elif D.',
    labels: ['fatura'],
    messages: [
      {
        id: 'm5',
        sender: 'customer',
        name: 'Zeynep Arslan',
        text: 'Ekteki faturada KDV %20 yerine %18 uygulanmış. Düzeltme rica ederim.',
        time: '13:12',
      },
    ],
  },
  {
    id: 'c4',
    customer: 'Can Demir',
    company: 'Perakende Plus',
    channel: 'whatsapp',
    status: 'resolved',
    preview: 'Teşekkürler, sorun çözüldü.',
    time: '3 sa',
    unread: false,
    labels: ['iade'],
    messages: [
      {
        id: 'm6',
        sender: 'customer',
        name: 'Can Demir',
        text: 'İade süreci tamamlandı, teşekkürler.',
        time: '11:40',
      },
      {
        id: 'm7',
        sender: 'agent',
        name: 'Siz',
        text: 'Rica ederiz Can Bey, iyi günler dileriz.',
        time: '11:42',
      },
    ],
  },
];

export const AI_SUGGESTIONS: Record<string, string[]> = {
  c1: [
    'Merhaba Ayşe Hanım, #4821 siparişinizi kontrol ettim. Depo çıkışı bugün 16:00 için planlandı; takip numarasını 30 dk içinde paylaşacağım.',
    'Siparişiniz hazırlık aşamasında; gecikme için özür dileriz. Öncelikli olarak kargoya alınması için operasyon ekibine ilettim.',
  ],
  c2: [
    'API anahtarınızı Ayarlar → Entegrasyonlar → MCP bölümünden oluşturabilirsiniz. Adım adım yardımcı olmamı ister misiniz?',
  ],
  c3: [
    'Merhaba Zeynep Hanım, faturanızı inceledik. Düzeltilmiş PDF’i 1 iş günü içinde e-posta ile ileteceğiz.',
  ],
};

export const MACROS = [
  {
    id: 'macro-1',
    title: 'Kargo gecikmesi',
    shortcut: '/kargo',
    body: 'Siparişiniz için özür dileriz. Operasyon ekibimiz kargoya çıkışı hızlandırdı; takip bilgisini kısa sürede paylaşacağız.',
  },
  {
    id: 'macro-2',
    title: 'API yönlendirme',
    shortcut: '/api',
    body: 'API anahtarınızı panelde Ayarlar → Entegrasyonlar → MCP altından oluşturabilirsiniz. Dokümantasyon: docs.blacknook.com/mcp',
  },
  {
    id: 'macro-3',
    title: 'Kapanış',
    shortcut: '/tesekkur',
    body: 'Yardımcı olabildiysek ne mutlu. Başka bir sorunuz olursa buradayız. İyi çalışmalar!',
  },
];

export const REPORT_STATS = [
  { label: 'Açık konuşma', value: '24', change: '+3' },
  { label: 'İlk yanıt (ort.)', value: '4 dk', change: '-18%' },
  { label: 'Çözüm süresi', value: '2s 14dk', change: '-6%' },
  { label: 'CSAT', value: '%94', change: '+2%' },
];

export const AGENT_PERFORMANCE = [
  { name: 'Siz', resolved: 18, avgReply: '3 dk' },
  { name: 'Elif D.', resolved: 14, avgReply: '5 dk' },
  { name: 'Burak T.', resolved: 11, avgReply: '6 dk' },
];
