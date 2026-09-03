export type MetabaseView = 'home' | 'question' | 'dashboard' | 'browse' | 'admin';

export const MB_NAV: { id: MetabaseView; label: string }[] = [
  { id: 'home', label: 'Ana sayfa' },
  { id: 'question', label: 'Soru' },
  { id: 'dashboard', label: 'Pano' },
  { id: 'browse', label: 'Veri' },
  { id: 'admin', label: 'Yönetim' },
];

export const KPI_CARDS = [
  { label: 'Bu ay gelir', value: '₺2.4M', change: '+12%', up: true },
  { label: 'Aktif müşteri', value: '1,847', change: '+8%', up: true },
  { label: 'Churn oranı', value: '%2.1', change: '-0.3%', up: true },
  { label: 'Ort. sipariş', value: '₺1,290', change: '-2%', up: false },
];

export const DASHBOARD_CHARTS = [
  { title: 'Aylık gelir trendi', type: 'line', height: 120 },
  { title: 'Kanal dağılımı', type: 'pie', height: 120 },
  { title: 'Bölge bazlı satış', type: 'bar', height: 120 },
  { title: 'Ürün kategorisi', type: 'bar', height: 120 },
];

export const TABLES = [
  { name: 'orders', rows: '124,502', cols: 12 },
  { name: 'customers', rows: '18,204', cols: 9 },
  { name: 'products', rows: '3,891', cols: 14 },
  { name: 'invoices', rows: '89,331', cols: 11 },
];

export const RECENT_QUESTIONS = [
  'Son 30 gün yeni müşteriler',
  'Aylık MRR özeti',
  'En çok satan 10 ürün',
  'Destek ticket çözüm süresi',
];
