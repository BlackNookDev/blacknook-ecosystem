export const ACCOUNT_NAV = [
  { href: '/account', label: 'Profil', icon: 'user' as const },
  { href: '/agent', label: 'NOOK Agent', icon: 'agent' as const },
  { href: '/account/messages', label: 'Mesajlar', icon: 'bell' as const },
  { href: '/account/requests', label: 'Talepler', icon: 'requests' as const },
  { href: '/account/products', label: 'Ürünler', icon: 'grid' as const },
  { href: '/account/billing', label: 'Ödemeler', icon: 'card' as const },
] as const;

export type AccountNavIcon = (typeof ACCOUNT_NAV)[number]['icon'];
