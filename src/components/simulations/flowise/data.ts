import type { DemoScene } from './types'

export const DEMO_SCENES: DemoScene[] = [
  {
    question: 'Şirketimizde uzaktan çalışma politikası nedir? Haftada kaç gün ofise gelmem gerekiyor?',
    time: '14:22',
    answer:
      'Uzaktan çalışma politikasına göre hibrit model uygulanır: haftada en az 2 gün ofiste bulunma zorunludur. Kalan günler uzaktan çalışılabilir; ekip lideri onayı ile esnetilebilir.',
    sources: ['İK Politikaları 2026.pdf', 'Uzaktan Çalışma Yönergesi.pdf'],
    tokens: 184,
    latencyMs: 1240,
  },
  {
    question: 'Yıllık izin hakkım kaç gün ve devreden izin kullanım süresi ne kadar?',
    time: '14:31',
    answer:
      'Kıdeminize göre yıllık izin hakkınız 14–26 gün arasındadır. Devreden izinler takip eden yılın Haziran sonuna kadar kullanılmalıdır; aksi halde HR onayı gerekir.',
    sources: ['İzin ve Devamsızlık Politikası.pdf'],
    tokens: 156,
    latencyMs: 980,
  },
  {
    question: 'Masraf fişi teslim süresi ve onay akışı nasıl işliyor?',
    time: '14:38',
    answer:
      'Masraf fişleri harcama tarihinden itibaren 5 iş günü içinde sisteme yüklenmelidir. Onay sırası: ekip lideri → finans → muhasebe. 5.000 ₺ üzeri harcamalar için ek yönetici onayı gerekir.',
    sources: ['Masraf ve Avans Prosedürü.pdf', 'Finans Onay Matrisi.xlsx'],
    tokens: 201,
    latencyMs: 1410,
  },
]

export const FLOW_NODES = [
  { id: 'input' as const, label: 'Chat Input', x: 8, y: 42 },
  { id: 'loader' as const, label: 'PDF Loader', x: 28, y: 18 },
  { id: 'embeddings' as const, label: 'OpenAI Embeddings', x: 28, y: 66 },
  { id: 'vector' as const, label: 'Pinecone Store', x: 52, y: 42 },
  { id: 'chain' as const, label: 'Retrieval Chain', x: 72, y: 42 },
  { id: 'output' as const, label: 'Chat Output', x: 90, y: 42 },
]
