import { BROWSE_CATEGORIES } from './navMenus';

/** Google sitelink / site navigation — canlı ekosistem kategorileri */
export const ECOSYSTEM_SITELINKS = BROWSE_CATEGORIES.map((cat) => ({
  id: cat.id,
  name: cat.label,
  path: `/services?category=${cat.id}`,
  description: cat.description,
}));
