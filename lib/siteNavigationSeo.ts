import { BROWSE_CATEGORIES } from './navMenus';

/** Google sitelink / site navigation — yalnızca canlı ekosistem kategorileri (yakında kanallar hariç) */
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  pazarlama: 'E-posta, analitik ve e-ticaret araçlarını keşfedin.',
  'veri-bi': 'BI panelleri, görselleştirme ve arama çözümleri.',
  'cms-icerik': 'CMS, blog ve dokümantasyon platformları.',
  operasyon: 'Self-host, izleme, dağıtım ve konteyner araçları.',
  'build-backend': 'Backend, veritabanı, yapay zeka ve otomasyon araçları.',
  'destek-kimlik': 'Kimlik, iletişim ve destek yazılımları.',
};

export type EcosystemSitelink = {
  id: string;
  name: string;
  path: string;
  description: string;
};

/** Navbar Ekosistem menüsündeki 6 canlı kategori — Bulut/Mini/Betik (yakında) dahil değil */
export const ECOSYSTEM_SITELINKS: EcosystemSitelink[] = BROWSE_CATEGORIES.map((cat) => ({
  id: cat.id,
  name: cat.label,
  path: `/services?category=${cat.id}`,
  description: CATEGORY_DESCRIPTIONS[cat.id] ?? `${cat.label} kategorisindeki araçları keşfedin.`,
}));
