import type { TranslateFn } from '@/lib/i18n';
import type { ServiceCatalogEntry } from '../../lib/data';
import { countBrowseCategory } from '../../lib/catalogBrowse';
import { BROWSE_CATEGORIES, ECOSYSTEM_NAV } from '../../lib/navMenus';

/** Navbar ve mobil menü — ekosistem linkleri */
export function getEcosystemNav(t: TranslateFn, catalog?: ServiceCatalogEntry[]) {
  const total = catalog?.length ?? 0;

  return {
    label: t('nav.ecosystem'),
    href: '/services',
    browseAllLabel: t('nav.browseAll'),
    categories: ECOSYSTEM_NAV.categories.map((item) => {
      const browseId = item.href.includes('category=')
        ? item.href.split('category=')[1]?.split('&')[0]
        : undefined;
      const count = browseId && catalog ? countBrowseCategory(catalog, browseId) : undefined;
      return {
        ...item,
        count,
      };
    }),
    trending: ECOSYSTEM_NAV.trending.slice(0, 4),
    featured: ECOSYSTEM_NAV.featured,
    browseGroups: BROWSE_CATEGORIES.map((group) => ({
      id: group.id,
      label: group.label,
      description: group.description,
      href: `/services?category=${group.id}`,
      count: catalog ? countBrowseCategory(catalog, group.id) : 0,
    })),
    total,
  };
}

export function getMobileSiteLinks(t: TranslateFn) {
  return [
    { href: '/developers/apply', label: t('footer.becomeDeveloper') },
    { href: '/partners/self-submission', label: t('footer.addProduct') },
    { href: '/sell', label: t('footer.sell') },
    { href: '/about', label: t('footer.about') },
    { href: '/help', label: t('footer.help') },
  ] as const;
}

export function getAccountNav(t: TranslateFn) {
  return [
    { href: '/account', label: t('account.profile'), icon: 'user' as const },
    { href: '/agent', label: t('account.nookAgent'), icon: 'agent' as const },
    { href: '/account/messages', label: t('account.notifications'), icon: 'bell' as const },
    { href: '/account/requests', label: t('account.requests'), icon: 'requests' as const },
    { href: '/account/products', label: t('account.products'), icon: 'grid' as const },
    { href: '/account/billing', label: t('account.billing'), icon: 'card' as const },
  ] as const;
}
