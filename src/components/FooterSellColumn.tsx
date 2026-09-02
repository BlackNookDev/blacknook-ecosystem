'use client';

import Link from 'next/link';
import { useTranslations } from '@/components/LocaleProvider';

export default function FooterSellColumn() {
  const { t } = useTranslations('footer');

  const links = [
    { href: '/developers/apply', label: t('becomeDeveloper') },
    { href: '/partners/self-submission', label: t('addProduct') },
    { href: '/sell', label: t('sell') },
    { href: '/partners/overview', label: t('devPortal') },
    { href: '/select', label: t('selectProgram') },
  ] as const;

  return (
    <div>
      <p className="bn-heading mb-4 text-sm font-semibold">{t('developer')}</p>
      <nav aria-label={t('developer')}>
        <ul className="space-y-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="bn-subtitle text-sm transition-colors duration-premium ease-premium hover:text-[var(--bn-heading)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
