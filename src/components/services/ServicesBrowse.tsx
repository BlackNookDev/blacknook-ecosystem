'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Filter, Search, X } from 'lucide-react';
import BrowseProductCard from '@/components/services/BrowseProductCard';
import ComingSoonCatalog from '@/components/services/ComingSoonCatalog';
import {
  BROWSE_CATEGORIES,
  NAV_MENUS,
  getBrowseCategory,
  getNavMenuServices,
  getServicesForBrowseCategory,
} from '../../../lib/navMenus';
import { getComingSoonCopy, isComingSoonMenuId } from '../../../lib/catalogChannels';
import { asOfficialCatalog, SERVICES, type ServiceCatalogEntry } from '../../../lib/data';
import { browseHeading, countBySubcategory } from '../../../lib/browseMeta';
import { cn } from '@/lib/utils';
import { apiFetch } from '@/lib/apiUrl';

type SortKey = 'recommended' | 'name-asc' | 'name-desc' | 'category';

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'recommended', label: 'Önerilen' },
  { id: 'name-asc', label: 'İsim A–Z' },
  { id: 'name-desc', label: 'İsim Z–A' },
  { id: 'category', label: 'Kategori' },
];

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

  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const [debouncedQ, setDebouncedQ] = useState(q);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [market, setMarket] = useState<ServiceCatalogEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    void apiFetch('/api/products', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { products: [] }))
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data.products) ? data.products : [];
        setMarket(list.filter((item: ServiceCatalogEntry) => item?.slug));
      })
      .catch(() => {
        if (!cancelled) setMarket([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const catalog = useMemo(() => {
    const slugs = new Set(market.map((item) => item.slug));
    return [...market, ...SERVICES.filter((item) => !slugs.has(item.slug)).map(asOfficialCatalog)];
  }, [market]);

  const category = searchParams.get('category') ?? '';
  const type = searchParams.get('type') ?? '';
  const cat = searchParams.get('cat') ?? '';
  const sort = (searchParams.get('sort') as SortKey) || 'recommended';

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQ(q.trim()), 220);
    return () => window.clearTimeout(t);
  }, [q]);

  useEffect(() => {
    setQ(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    if (!filtersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFiltersOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [filtersOpen]);

  const pushParams = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([key, value]) => {
        if (!value) params.delete(key);
        else params.set(key, value);
      });
      // Eski / sahte filtre parametrelerini temizle
      ['badge', 'best', 'int', 'plan'].forEach((k) => params.delete(k));
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

  const comingSoon = isComingSoonMenuId(type) ? getComingSoonCopy(type) : null;

  const basePool = useMemo(() => {
    if (comingSoon) return [];
    const browse = category ? getBrowseCategory(category) : undefined;
    if (browse) {
      const fromMarket = market.filter((item) => browse.match.includes(item.category));
      const slugs = new Set(fromMarket.map((item) => item.slug));
      const staticList = getServicesForBrowseCategory(browse.id)
        .filter((item) => !slugs.has(item.slug))
        .map(asOfficialCatalog);
      return [...fromMarket, ...staticList];
    }
    if (type === 'saas' || type === 'micro-saas') {
      const fromMarket = market.filter((item) => (item.listingType || 'saas') === type);
      const slugs = new Set(fromMarket.map((item) => item.slug));
      const staticList = SERVICES.filter(
        (item) => item.listingType === type && !slugs.has(item.slug)
      ).map(asOfficialCatalog);
      return [...fromMarket, ...staticList];
    }
    const menu = NAV_MENUS.find((m) => m.id === type);
    if (menu) return [...market, ...getNavMenuServices(menu)];
    return catalog;
  }, [category, type, comingSoon, market, catalog]);

  const filtered = useMemo(() => {
    let list = basePool;
    if (cat) list = list.filter((s) => s.category === cat);

    if (debouncedQ) {
      const needle = debouncedQ.toLocaleLowerCase('tr');
      list = list.filter(
        (s) =>
          s.name.toLocaleLowerCase('tr').includes(needle) ||
          s.description.toLocaleLowerCase('tr').includes(needle) ||
          s.category.toLocaleLowerCase('tr').includes(needle) ||
          s.features.some((f) => f.toLocaleLowerCase('tr').includes(needle))
      );
    }

    return sortList(list, SORT_OPTIONS.some((o) => o.id === sort) ? sort : 'recommended');
  }, [basePool, cat, debouncedQ, sort]);

  const subcats = useMemo(() => countBySubcategory(basePool), [basePool]);

  const heading = category
    ? browseHeading(category)
    : type
      ? `${NAV_MENUS.find((m) => m.id === type)?.label ?? ''} keşfet`
      : 'Ekosistemi keşfet';

  const hasActiveFilters = Boolean(category || type || cat || debouncedQ);

  const isAreaEmpty =
    !comingSoon &&
    filtered.length === 0 &&
    Boolean(category) &&
    !debouncedQ &&
    !cat;

  const clearAll = () => {
    setQ('');
    startTransition(() => router.replace(pathname, { scroll: false }));
    setFiltersOpen(false);
  };

  const FilterPanel = (
    <div className="space-y-6 text-sm">
      <section>
        <h2 className="mb-3 font-display text-sm font-semibold tracking-tight text-zinc-100">
          Kategoriye göre
        </h2>
        <ul className="space-y-0.5">
          <li>
            <button
              type="button"
              onClick={() => {
                pushParams({ category: null, type: null, cat: null });
                setFiltersOpen(false);
              }}
              className={cn(
                'w-full rounded-md px-1 py-1.5 text-left text-sm transition-colors',
                !category && !type
                  ? 'font-semibold text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              )}
            >
              Tümü
              <span className="ml-1 text-zinc-600">({catalog.length})</span>
            </button>
          </li>
          {BROWSE_CATEGORIES.map((c) => {
            const active = category === c.id;
            const count =
              getServicesForBrowseCategory(c.id).length +
              market.filter((item) => c.match.includes(item.category)).length;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    pushParams({ category: c.id, type: null, cat: null });
                    setFiltersOpen(false);
                  }}
                  className={cn(
                    'w-full rounded-md px-1 py-1.5 text-left text-sm transition-colors',
                    active ? 'font-semibold text-white' : 'text-zinc-400 hover:text-zinc-200'
                  )}
                >
                  {c.label}
                  <span className="ml-1 text-zinc-600">({count})</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {category && subcats.length > 1 ? (
        <section>
          <h2 className="mb-3 font-display text-sm font-semibold tracking-tight text-zinc-100">
            Alt kategori
          </h2>
          <ul className="space-y-0.5">
            {subcats.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => {
                    pushParams({ cat: cat === item.label ? null : item.label });
                    setFiltersOpen(false);
                  }}
                  className={cn(
                    'w-full rounded-md px-1 py-1.5 text-left text-sm transition-colors',
                    cat === item.label
                      ? 'font-semibold text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  )}
                >
                  {item.label}
                  <span className="ml-1 text-zinc-600">({item.count})</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {hasActiveFilters ? (
        <button
          type="button"
          onClick={clearAll}
          className="text-sm font-medium text-zinc-300 hover:text-white"
        >
          Filtreleri temizle
        </button>
      ) : null}
    </div>
  );

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
            placeholder={`Ekosistem ara (${catalog.length})`}
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

      {(category || type || cat) && (
        <button
          type="button"
          onClick={clearAll}
          className="mb-4 text-[13px] font-medium text-sky-400 hover:text-sky-300"
        >
          ← Ekosisteme dön
        </button>
      )}

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {heading}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            {comingSoon ? 'Yakında' : `${filtered.length} ürün`}
          </p>
        </div>

        {!comingSoon ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 px-3 text-sm font-semibold text-zinc-200 lg:hidden"
            >
              <Filter className="h-4 w-4" aria-hidden />
              Kategoriler
            </button>
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
        ) : null}
      </header>

      <div className="flex gap-8 xl:gap-10">
        {!comingSoon ? (
          <aside
            className="hidden w-[220px] shrink-0 border-r border-white/[0.06] pr-6 lg:block"
            aria-label="Kategoriler"
          >
            {FilterPanel}
          </aside>
        ) : null}

        <div className="min-w-0 flex-1">
          {comingSoon ? (
            <ComingSoonCatalog copy={comingSoon} />
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 px-6 py-20 text-center">
              <p className="text-sm font-medium text-zinc-300">
                {isAreaEmpty
                  ? 'Şu an bu alanda ürün bulunmuyor.'
                  : 'Aramanıza uygun ürün yok.'}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-zinc-500">
                {isAreaEmpty
                  ? 'Başka bir kategoriye bakabilir veya ekosisteme dönebilirsiniz.'
                  : 'Aramayı temizleyerek veya kategoriyi değiştirerek deneyin.'}
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-5 text-sm font-medium text-sky-400 hover:text-sky-300"
              >
                Tüm ekosistemi gör
              </button>
            </div>
          ) : (
            <section aria-label={`${heading} listesi`}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((service) => (
                  <BrowseProductCard key={service.slug} service={service} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {filtersOpen && !comingSoon ? (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal aria-label="Kategoriler">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Kapat"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-3xl border border-white/10 bg-[var(--bn-bg,#161618)] p-6 pb-[max(3rem,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-display text-lg font-semibold text-white">Kategoriler</p>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-white/[0.06]"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {FilterPanel}
          </div>
        </div>
      ) : null}
    </div>
  );
}
