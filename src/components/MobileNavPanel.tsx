'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useLocale, useTranslations } from '@/components/LocaleProvider';
import { getEcosystemNav, getMobileSiteLinks } from '@/lib/navMenusI18n';
import NavAuth from '@/components/NavAuth';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MobileNavPanel({ open, onClose }: Props) {
  const { t } = useLocale();
  const { t: tn } = useTranslations('nav');
  const ecosystemNav = useMemo(() => getEcosystemNav(t), [t]);
  const siteLinks = useMemo(() => getMobileSiteLinks(t), [t]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal aria-label={tn('menu')}>
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label={tn('closeMenu')}
        onClick={onClose}
      />
      <div className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col border-r border-white/10 bg-[var(--bn-bg,#161618)] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] shadow-2xl">
        <div className="flex items-center justify-between px-4 pb-3 pt-3">
          <p className="font-display text-lg font-semibold text-white">{tn('menu')}</p>
          <div className="flex items-center gap-2">
            <NavAuth />
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white"
              aria-label={tn('closeMenu')}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-6">
          <section>
            <ul className="space-y-0.5">
              {ecosystemNav.categories.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block rounded-xl px-3 py-2.5 text-sm text-zinc-200 transition-colors hover:bg-white/[0.05]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {ecosystemNav.trending.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.05]"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                      {item.title}
                      {'badge' in item && item.badge ? (
                        <span className="rounded bg-emerald-500 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-white">
                          {item.badge}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={ecosystemNav.href}
                  onClick={onClose}
                  className="mt-1 block rounded-xl px-3 py-2.5 text-sm font-semibold text-sky-300 transition-colors hover:bg-white/[0.05]"
                >
                  {ecosystemNav.browseAllLabel}
                </Link>
              </li>
            </ul>
          </section>

          <section className="border-t border-white/10 pt-4">
            <ul className="space-y-0.5">
              {siteLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
