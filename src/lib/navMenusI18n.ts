import type { TranslateFn } from '@/lib/i18n';
import type { ServiceCatalogEntry } from '../../lib/data';
import { countBrowseCategory } from '../../lib/catalogBrowse';
import { BROWSE_CATEGORIES, ECOSYSTEM_NAV } from '../../lib/navMenus';

/** Navbar ve mobil menü — B2B ajan / departman linkleri */
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

export function getMobileSiteLinks(_t: TranslateFn) {
  return [
    { href: '/services', label: 'Ajan kataloğu' },
    { href: '/agent', label: 'Departman paneli' },
    { href: '/account/requests', label: 'Kurulum talepleri' },
    { href: '/about', label: 'Hakkımızda' },
    { href: '/help', label: 'Yardım' },
  ] as const;
}

export function getAccountNav(t: TranslateFn) {
  return [
    { href: '/account', label: t('account.profile'), icon: 'user' as const },
    { href: '/agent', label: t('account.nookAgent'), icon: 'agent' as const },
    { href: '/account/requests', label: t('account.requests'), icon: 'requests' as const },
  ] as const;
}
