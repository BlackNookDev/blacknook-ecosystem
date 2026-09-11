'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { PaytrTrustRow } from '@/components/PaytrLogo';
import { useTranslations } from '@/components/LocaleProvider';

function FooterColumn({
  title,
  links,
  ariaLabel,
}: {
  title: string;
  links: { href: string; label: string }[];
  ariaLabel: string;
}) {
  return (
    <div>
      <p className="bn-heading mb-4 text-sm font-semibold">{title}</p>
      <nav aria-label={ariaLabel}>
        <ul className="space-y-3">
          {links.map((link) => (
            <li key={`${link.href}-${link.label}`}>
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

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

export default function Footer() {
  const { t } = useTranslations('footer');

  const productLinks = [
    { href: '/services', label: 'Ajan kataloğu' },
    { href: '/agent', label: 'Departman paneli' },
    { href: '/account/requests', label: 'Kurulum talepleri' },
  ];

  const accountLinks = [
    { href: '/help', label: t('help') },
    { href: '/terms', label: t('terms') },
    { href: '/privacy', label: t('privacy') },
  ];

  const companyLinks = [
    { href: '/about', label: t('about') },
    { href: '/services', label: 'Ekosistem' },
  ];

  return (
    <footer className="theme-surface relative border-t border-white/[0.06]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <BrandLogo textClassName="text-xl" iconClassName="h-8 w-8" />
          <div className="mt-5 flex items-center gap-2.5">
            <a
              href="https://www.linkedin.com/company/black-nook/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
              aria-label={t('linkedin')}
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
            <a
              href="https://chat.whatsapp.com/G528JIyeIZN3WGL2OhP15o"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
              aria-label={t('whatsapp')}
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <FooterColumn title="Ürün" links={productLinks} ariaLabel="Ürün" />
        <FooterColumn title={t('support')} links={accountLinks} ariaLabel={t('support')} />
        <FooterColumn title={t('company')} links={companyLinks} ariaLabel={t('company')} />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/[0.06] px-6 py-5 sm:flex-row">
        <p className="text-xs text-zinc-600">
          {t('copyright', { year: new Date().getFullYear() })}
        </p>
        <PaytrTrustRow />
      </div>
    </footer>
  );
}
