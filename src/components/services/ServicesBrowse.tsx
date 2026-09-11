'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Search, X } from 'lucide-react';
import BrowseProductCard from '@/components/services/BrowseProductCard';
import SubheadingFilterChips from '@/components/services/SubheadingFilterChips';
import {
  filterBySubheading,
  getServicesSubheadingOptions,
} from '../../../lib/catalogSubheadings';
import {
  filterCatalog,
  getBrowseCategoryOptions,
  resolveBrowseHeading,
} from '../../../lib/catalogBrowse';
import { getBrowseCategory } from '../../../lib/navMenus';
import { asOfficialCatalog, getFullCatalog, type ServiceCatalogEntry } from '../../../lib/data';

type SortKey = 'recommended' | 'name-asc' | 'name-desc' | 'category';

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'recommended', label: 'Önerilen' },
  { id: 'name-asc', label: 'İsim A–Z' },
  { id: 'name-desc', label: 'İsim Z–A' },
  { id: 'category', label: 'Kategori' },
];

const TYPE_LABELS: Record<string, string> = {
  saas: 'Bulut yazılım',
  'micro-saas': 'Mini yazılım',
  script: 'Betikler',
};

function sortList(list: ServiceCatalogEntry[], sort: SortKey) {
  const next = [...list];
  if (sort === 'name-asc') next.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  else if (sort === 'name-desc') next.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
  else if (sort === 'category')
    next.sort(
      (a, b) =>
        a.category.localeCompare(b.category, 'tr') || a.name.localeCompare(b.name, 'tr')
    );
  return next;
}

export default function ServicesBrowse() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const catalog = useMemo(() => getFullCatalog(), []);
  const browseOptions = useMemo(() => getBrowseCategoryOptions(catalog), [catalog]);

  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const [debouncedQ, setDebouncedQ] = useState(q);

  const categoryParam = searchParams.get('category');
  const categoryFilter = categoryParam ?? 'Tümü';
  const subCategory = searchParams.get('cat');
  const subheading = searchParams.get('sub');
  const typeFilter = searchParams.get('type');
  const sort = (searchParams.get('sort') as SortKey) || 'recommended';

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQ(q.trim()), 220);
    return () => window.clearTimeout(t);
  }, [q]);

  useEffect(() => {
    setQ(searchParams.get('q') ?? '');
  }, [searchParams]);

  const pushParams = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([key, value]) => {
        if (!value) params.delete(key);
        else params.set(key, value);
      });
      params.delete('mcp');
      params.delete('license');
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    const current = searchParams.get('q') ?? '';
    if (debouncedQ === current) return;
    pushParams({ q: debouncedQ || null });
  }, [debouncedQ, pushParams, searchParams]);

  const filtered = useMemo(() => {
    let list = filterCatalog(catalog, {
      category: categoryFilter === 'Tümü' ? null : categoryFilter,
      cat: subCategory,
      type: typeFilter,
      q: debouncedQ,
    });
    list = filterBySubheading(list, subheading);
    return sortList(list, SORT_OPTIONS.some((o) => o.id === sort) ? sort : 'recommended');
  }, [catalog, categoryFilter, debouncedQ, sort, subCategory, subheading, typeFilter]);

  const subheadingOptions = useMemo(
    () =>
      getServicesSubheadingOptions(catalog, {
        category: categoryFilter === 'Tümü' ? null : categoryFilter,
        cat: subCategory,
        type: typeFilter,
        q: debouncedQ,
      }),
    [catalog, categoryFilter, debouncedQ, subCategory, typeFilter]
  );

  const activeBrowse = categoryFilter !== 'Tümü' ? getBrowseCategory(categoryFilter) : undefined;
  const subCategoryOptions = useMemo(() => {
    if (!activeBrowse) return [];
    const withinBrowse = filterCatalog(catalog, {
      category: categoryFilter,
      type: typeFilter,
    });
    const counts = new Map<string, number>();
    withinBrowse.forEach((item) => {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'tr'));
  }, [activeBrowse, catalog, categoryFilter, typeFilter]);

  const clearAll = () => {
    setQ('');
    startTransition(() => router.replace(pathname, { scroll: false }));
  };

  const hasActiveFilters = Boolean(
    debouncedQ || categoryFilter !== 'Tümü' || typeFilter || subCategory || subheading
  );

  const heading = resolveBrowseHeading(categoryFilter === 'Tümü' ? null : categoryFilter);

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      <div className="mb-8">
        <label className="relative mx-auto block max-w-2xl">
          <span className="sr-only">Ürün ara</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            aria-hidden
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`MCP ajanı ara (${catalog.length})`}
            className="h-12 w-full rounded-full border border-white/15 bg-white/[0.04] py-2 pl-11 pr-10 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10"
          />
          {q ? (
            <button
              type="button"
              onClick={() => setQ('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              aria-label="Temizle"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </label>
      </div>

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {typeFilter && TYPE_LABELS[typeFilter] ? TYPE_LABELS[typeFilter] : heading}
          </h1>
          {typeFilter === 'script' ? (
            <p className="mt-2 text-xs text-amber-300/90">Betik kataloğu yakında yayınlanacak.</p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-2 text-sm text-zinc-500">
            <span>Kategori:</span>
            <span className="relative">
              <select
                value={categoryFilter}
                onChange={(e) =>
                  pushParams({
                    category: e.target.value === 'Tümü' ? null : e.target.value,
                    cat: null,
                    sub: null,
                  })
                }
                className="h-10 max-w-[13rem] appearance-none rounded-lg border border-white/15 bg-transparent py-1.5 pl-3 pr-8 text-sm font-medium text-zinc-200 outline-none focus:border-white/30"
              >
                <option value="Tümü" className="bg-zinc-900">
                  Tümü ({catalog.length})
                </option>
                {browseOptions.map((item) => (
                  <option key={item.id} value={item.id} className="bg-zinc-900">
                    {item.label} ({item.count})
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
                aria-hidden
              />
            </span>
          </label>

          {subCategoryOptions.length > 1 ? (
            <label className="inline-flex items-center gap-2 text-sm text-zinc-500">
              <span>Alt kategori:</span>
              <span className="relative">
                <select
                  value={subCategory ?? ''}
                  onChange={(e) => pushParams({ cat: e.target.value || null })}
                  className="h-10 max-w-[12rem] appearance-none rounded-lg border border-white/15 bg-transparent py-1.5 pl-3 pr-8 text-sm font-medium text-zinc-200 outline-none focus:border-white/30"
                >
                  <option value="" className="bg-zinc-900">
                    Tümü
                  </option>
                  {subCategoryOptions.map((item) => (
                    <option key={item.label} value={item.label} className="bg-zinc-900">
                      {item.label} ({item.count})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
                  aria-hidden
                />
              </span>
            </label>
          ) : null}

          <label className="inline-flex items-center gap-2 text-sm text-zinc-500">
            <span>Sırala:</span>
            <span className="relative">
              <select
                value={sort}
                onChange={(e) =>
                  pushParams({
                    sort: e.target.value === 'recommended' ? null : e.target.value,
                  })
                }
                className="h-10 appearance-none rounded-lg border border-white/15 bg-transparent py-1.5 pl-3 pr-8 text-sm font-medium text-zinc-200 outline-none focus:border-white/30"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id} className="bg-zinc-900">
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
                aria-hidden
              />
            </span>
          </label>
        </div>
      </header>

      {subheadingOptions.length > 0 ? (
        <div className="mb-6">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            Alt başlıklar
          </p>
          <SubheadingFilterChips
            options={subheadingOptions}
            activeId={subheading}
            onChange={(id) =>
              pushParams({
                sub: id,
                cat: id?.startsWith('cat:') ? id.slice(4) : null,
              })
            }
          />
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 px-6 py-20 text-center">
          <p className="text-sm font-medium text-zinc-300">Aramanıza uygun çözüm bulunamadı.</p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="mt-5 text-sm font-medium text-sky-400 hover:text-sky-300"
            >
              Tüm ekosistemi gör
            </button>
          ) : null}
        </div>
      ) : (
        <section aria-label="Ekosistem listesi">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((service) => (
              <BrowseProductCard key={service.slug} service={asOfficialCatalog(service)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
