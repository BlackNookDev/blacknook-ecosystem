'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLocale } from '@/components/LocaleProvider';
import { countBrowseCategory, getBrowsePreview } from '../../lib/catalogBrowse';
import { getFullCatalog } from '../../lib/data';
import { getEcosystemNav } from '@/lib/navMenusI18n';

export default function NavDropdown() {
  const { t } = useLocale();
  const catalog = useMemo(() => getFullCatalog(), []);
  const ecosystemNav = useMemo(() => getEcosystemNav(t, catalog), [catalog, t]);
  const browseCategories = ecosystemNav.categories.filter((item) => item.href.includes('category='));
  const channelCategories = ecosystemNav.categories.filter((item) => item.href.includes('type='));
  const [activeHref, setActiveHref] = useState(browseCategories[0]?.href ?? '');

  const activeCategory = browseCategories.find((item) => item.href === activeHref) ?? browseCategories[0];
  const activeBrowseId = activeCategory?.href.split('category=')[1]?.split('&')[0] ?? '';
  const preview = useMemo(
    () => (activeBrowseId ? getBrowsePreview(catalog, activeBrowseId, 3) : []),
    [activeBrowseId, catalog]
  );
  const previewCount = activeBrowseId ? countBrowseCategory(catalog, activeBrowseId) : catalog.length;

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
        className="invisible absolute right-0 top-[calc(100%+0.4rem)] z-50 w-[min(44rem,calc(100vw-2rem))] origin-top-right scale-[0.98] opacity-0 transition-all duration-premium ease-premium group-hover:visible group-hover:scale-100 group-hover:opacity-100 group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100"
        role="menu"
        aria-label={ecosystemNav.label}
      >
        <div
          data-nav-menu
          className="overflow-hidden rounded-2xl border border-white/[0.1] bg-zinc-950 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.75)] sm:p-5"
        >
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-6">
            <div>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Departmanlar
              </p>
              <ul className="space-y-0.5">
                {browseCategories.map((item) => {
                  const active = activeHref === item.href;
                  const browseId = item.href.split('category=')[1]?.split('&')[0] ?? '';
                  const count = browseId ? countBrowseCategory(catalog, browseId) : 0;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        role="menuitem"
                        onMouseEnter={() => setActiveHref(item.href)}
                        className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                          active
                            ? 'bg-sky-500/15 font-medium text-sky-100'
                            : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="text-[11px] tabular-nums text-zinc-500">{count}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {channelCategories.length > 0 ? (
                <div className="mt-3 border-t border-white/[0.06] pt-3">
                  <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    Kanallar
                  </p>
                  <ul className="space-y-0.5">
                    {channelCategories.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          role="menuitem"
                          className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-zinc-200"
                        >
                          <span>{item.label}</span>
                          {'badge' in item && item.badge ? (
                            <span className="rounded bg-amber-500/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-amber-200">
                              {item.badge}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Önizleme
              </p>
              <p className="mt-1 text-sm font-medium text-zinc-100">{activeCategory?.label}</p>
              {'description' in activeCategory && activeCategory.description ? (
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">{activeCategory.description}</p>
              ) : null}
              <p className="mt-2 text-xs text-sky-300">{previewCount} çözüm</p>
              <ul className="mt-3 space-y-2">
                {preview.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/service/${item.slug}`}
                      className="block rounded-lg px-2 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-white/[0.04] hover:text-white"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              {activeCategory ? (
                <Link
                  href={activeCategory.href}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300"
                >
                  Tümünü gör
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </Link>
              ) : null}
            </div>

            <div>
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Öne çıkanlar
              </p>
              <ul className="space-y-1">
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

              {ecosystemNav.featured ? (
                <Link
                  href={ecosystemNav.featured.href}
                  className="mt-4 block rounded-xl border border-teal-500/20 bg-teal-500/[0.08] p-3 transition-colors hover:border-teal-400/30 hover:bg-teal-500/[0.12]"
                >
                  <p className="text-sm font-semibold text-teal-100">{ecosystemNav.featured.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-teal-200/70">
                    {ecosystemNav.featured.description}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-teal-300">
                    {ecosystemNav.featured.cta}
                    <ArrowRight className="h-3 w-3" aria-hidden />
                  </span>
                </Link>
              ) : null}
            </div>
          </div>

          <Link
            href={ecosystemNav.href}
            role="menuitem"
            className="mt-4 inline-flex items-center gap-1.5 border-t border-white/[0.06] pt-4 text-sm font-semibold text-zinc-200 transition-colors hover:text-white"
          >
            {ecosystemNav.browseAllLabel}
            <span className="text-xs font-normal text-zinc-500">({catalog.length})</span>
            <ArrowRight className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
