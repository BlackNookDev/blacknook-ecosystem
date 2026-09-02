import type { DemoScene, ReceiptItem } from './types'

export const INITIAL_SPEND = 42600
export const INITIAL_PENDING = 4
export const CHEQUE_AMOUNT = 210000

export const INITIAL_RECEIPTS: ReceiptItem[] = [
  {
    id: 'REC-001',
    date: '25.08.2026',
    project: 'Kadıköy Rezidans',
    vendor: 'Opet Petrolcülük A.Ş.',
    vkn: '6430012948',
    category: 'Akaryakıt / Jeneratör',
    subtotal: 3500.0,
    tax: 700.0,
    total: 4200.0,
    status: 'approved',
  },
  {
    id: 'REC-002',
    date: '25.08.2026',
    project: 'Maslak Ticari',
    vendor: 'Koçtaş Yapı Marketleri',
    vkn: '5740039201',
    category: 'Elektrik & Tesisat',
    subtotal: 12000.0,
    tax: 2400.0,
    total: 14400.0,
    status: 'pending',
  },
  {
    id: 'REC-003',
    date: '25.08.2026',
    project: 'Kadıköy Rezidans',
    vendor: 'Akçansa Çimento San. ve Tic. A.Ş.',
    vkn: '0250038522',
    category: 'Çimento / Hazır Beton',
    subtotal: 8500.0,
    tax: 1700.0,
    total: 10200.0,
    status: 'pending',
  },
]

export const DEMO_SCENES: DemoScene[] = [
  {
    message: 'Karaköy nalburundan spiral taşı ve sarf malzeme alındı, fiş görseli ektedir.',
    time: '14:28',
    slipNo: '001847',
    slipTime: '14:26',
    lines: [
      { label: 'Spiral Taş 115mm × 4', amount: '1.850,00' },
      { label: 'Sarf Malzeme (vida/ankraj)', amount: '2.191,67' },
    ],
    receipt: {
      id: 'REC-004',
      date: '25.08.2026',
      project: 'Proje-01 / Kadıköy Rezidans',
      vendor: 'Karaköy Hırdavat San. Tic. Ltd. Şti.',
      vkn: '3948192301',
      category: 'Spiral Taşı / Sarf Malzeme',
      subtotal: 4041.67,
      tax: 808.33,
      total: 4850.0,
      status: 'pending',
    },
  },
  {
    message: 'Maslak şantiyesine kablo ve pano malzemesi alındı, fişi ilettim.',
    time: '15:12',
    slipNo: '002103',
    slipTime: '15:09',
    lines: [
      { label: 'NYM Kablo 3x2.5 × 2', amount: '5.200,00' },
      { label: 'Sigorta / Pano', amount: '3.133,33' },
    ],
    receipt: {
      id: 'REC-005',
      date: '25.08.2026',
      project: 'Maslak Ticari',
      vendor: 'Koçtaş Yapı Marketleri',
      vkn: '5740039201',
      category: 'Elektrik & Tesisat',
      subtotal: 8333.33,
      tax: 1666.67,
      total: 10000.0,
      status: 'pending',
    },
  },
  {
    message: 'Jeneratör için motorin alındı, fiş görseli ektedir.',
    time: '16:04',
    slipNo: '884291',
    slipTime: '16:01',
    lines: [
      { label: 'Motorin 180 lt', amount: '5.250,00' },
    ],
    receipt: {
      id: 'REC-006',
      date: '25.08.2026',
      project: 'Kadıköy Rezidans',
      vendor: 'Opet Petrolcülük A.Ş.',
      vkn: '6430012948',
      category: 'Akaryakıt / Jeneratör',
      subtotal: 5250.0,
      tax: 1050.0,
      total: 6300.0,
      status: 'pending',
    },
  },
]
