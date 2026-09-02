import type { TranslateFn } from '@/lib/i18n';
import { BROWSE_CATEGORIES, ECOSYSTEM_NAV } from '../../lib/navMenus';

/** Navbar ve mobil menü — sade ekosistem linkleri */
export function getEcosystemNav(t: TranslateFn) {
  return {
    label: t('nav.ecosystem'),
    href: '/services',
    browseAllLabel: t('nav.browseAll'),
    categories: BROWSE_CATEGORIES.map((c) => ({
      label: c.label,
      href: `/services?category=${c.id}`,
    })),
    trending: ECOSYSTEM_NAV.trending.slice(0, 4),
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
    { href: '/account/messages', label: t('account.messages'), icon: 'inbox' as const },
    { href: '/account/requests', label: t('account.requests'), icon: 'requests' as const },
    { href: '/account/products', label: t('account.products'), icon: 'grid' as const },
    { href: '/account/billing', label: t('account.billing'), icon: 'card' as const },
  ] as const;
}
