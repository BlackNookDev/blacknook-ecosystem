export type PlausibleView = 'dashboard' | 'pages' | 'sources' | 'goals' | 'settings';

export const PL_NAV: { id: PlausibleView; label: string }[] = [
  { id: 'dashboard', label: 'Genel bakış' },
  { id: 'pages', label: 'Sayfalar' },
  { id: 'sources', label: 'Kaynaklar' },
  { id: 'goals', label: 'Hedefler' },
  { id: 'settings', label: 'Ayarlar' },
];

export const STATS = [
  { label: 'Ziyaretçi', value: '12.4K', change: '+18%' },
  { label: 'Sayfa görüntüleme', value: '28.1K', change: '+12%' },
  { label: 'Hemen çıkma', value: '%42', change: '-3%' },
  { label: 'Ort. süre', value: '2m 14s', change: '+8%' },
];

export const TOP_PAGES = [
  { path: '/', views: 8420, bounce: '%38' },
  { path: '/services', views: 5210, bounce: '%45' },
  { path: '/service/cal-com', views: 1890, bounce: '%32' },
  { path: '/agent', views: 1420, bounce: '%28' },
];

export const SOURCES = [
  { name: 'Google', share: '48%' },
  { name: 'Direct', share: '22%' },
  { name: 'LinkedIn', share: '14%' },
  { name: 'Newsletter', share: '9%' },
];
