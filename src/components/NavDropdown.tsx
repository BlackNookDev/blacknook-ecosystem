'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLocale } from '@/components/LocaleProvider';
import { getEcosystemNav } from '@/lib/navMenusI18n';

export default function NavDropdown() {
  const { t } = useLocale();
  const ecosystemNav = useMemo(() => getEcosystemNav(t), [t]);
  const [activeCat, setActiveCat] = useState(ecosystemNav.categories[0]?.href ?? '');

  return (
    <div className="group relative hidden md:block">
      <button
        type="button"
        className="bn-nav-menu-btn inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-zinc-400 transition-colors duration-premium ease-premium hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 group-hover:text-white"
        aria-haspopup="menu"
        aria-expanded="false"
      >
        {ecosystemNav.label}
        <ChevronDown
          className="h-3.5 w-3.5 opacity-60 transition-transform duration-premium ease-premium group-hover:rotate-180"
          aria-hidden
        />
      </button>

      <div
        className="invisible absolute right-0 top-[calc(100%+0.4rem)] z-50 w-[min(34rem,calc(100vw-2rem))] origin-top-right scale-[0.98] opacity-0 transition-all duration-premium ease-premium group-hover:visible group-hover:scale-100 group-hover:opacity-100 group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100"
        role="menu"
        aria-label={ecosystemNav.label}
      >
        <div
          data-nav-menu
          className="overflow-hidden rounded-2xl border border-white/[0.1] bg-zinc-950 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.75)] sm:p-5"
        >
          <div className="grid grid-cols-2 gap-5 sm:gap-6">
            <ul className="space-y-0.5">
              {ecosystemNav.categories.map((item) => {
                const active = activeCat === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      role="menuitem"
                      onMouseEnter={() => setActiveCat(item.href)}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? 'bg-sky-500/15 font-medium text-sky-100'
                          : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <ul className="space-y-1 border-l border-white/[0.06] pl-5">
              {ecosystemNav.trending.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    role="menuitem"
                    className="group/item block rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.04]"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-zinc-100 group-hover/item:text-white">
                      {item.title}
                      {'badge' in item && item.badge ? (
                        <span className="rounded bg-emerald-500/90 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-white">
                          {item.badge}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-zinc-500">
                      {item.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href={ecosystemNav.href}
            role="menuitem"
            className="mt-4 inline-flex items-center gap-1.5 border-t border-white/[0.06] pt-4 text-sm font-semibold text-zinc-200 transition-colors hover:text-white"
          >
            {ecosystemNav.browseAllLabel}
            <ArrowRight className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
