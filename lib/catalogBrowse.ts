import { getFullCatalog, type ServiceCatalogEntry } from './data';
import {
  BROWSE_CATEGORIES,
  getBrowseCategory,
  type BrowseCategory,
} from './navMenus';
import { HERO_AGENT_SLUGS } from './heroAgents';

export { HERO_AGENT_SLUGS };
/** @deprecated HERO_AGENT_SLUGS kullanın */
export const NOOK_PLATFORM_SLUGS = HERO_AGENT_SLUGS;

export type CatalogListingType = 'saas' | 'micro-saas' | 'service';

export function getCatalogListingType(service: ServiceCatalogEntry): CatalogListingType {
  return service.listingType || 'service';
}

export function filterCatalogByBrowse(
  catalog: ServiceCatalogEntry[],
  browseId: string | null | undefined
): ServiceCatalogEntry[] {
  if (!browseId || browseId === 'Tümü') return catalog;

  const browse = getBrowseCategory(browseId);
  if (browse) {
    return catalog.filter(
      (item) => browse.match.includes(item.category) || browse.slugs?.includes(item.slug)
    );
  }

  const byCategory = catalog.filter((item) => item.category === browseId);
  if (byCategory.length > 0) return byCategory;

  return catalog;
}

export function filterCatalogByType(
  catalog: ServiceCatalogEntry[],
  type: string | null | undefined
): ServiceCatalogEntry[] {
  if (!type) return catalog;
  if (type === 'script') return [];
  return catalog.filter((item) => getCatalogListingType(item) === type);
}

export function filterCatalog(
  catalog: ServiceCatalogEntry[],
  filters: {
    category?: string | null;
    cat?: string | null;
    type?: string | null;
    q?: string | null;
  }
): ServiceCatalogEntry[] {
  let list = catalog;

  if (filters.type) {
    list = filterCatalogByType(list, filters.type);
  }

  if (filters.category && filters.category !== 'Tümü') {
    list = filterCatalogByBrowse(list, filters.category);
    if (filters.cat) {
      list = list.filter((item) => item.category === filters.cat);
    }
  }

  const needle = filters.q?.trim().toLocaleLowerCase('tr');
  if (needle) {
    list = list.filter(
      (item) =>
        item.name.toLocaleLowerCase('tr').includes(needle) ||
        item.description.toLocaleLowerCase('tr').includes(needle) ||
        item.category.toLocaleLowerCase('tr').includes(needle) ||
        item.features.some((feature) => feature.toLocaleLowerCase('tr').includes(needle))
    );
  }

  return list;
}

export function countBrowseCategory(
  catalog: ServiceCatalogEntry[],
  browseId: string
): number {
  return filterCatalogByBrowse(catalog, browseId).length;
}

export function getBrowsePreview(
  catalog: ServiceCatalogEntry[],
  browseId: string,
  limit = 3
): ServiceCatalogEntry[] {
  return filterCatalogByBrowse(catalog, browseId).slice(0, limit);
}

export function getCatalogCategoryOptions(catalog: ServiceCatalogEntry[]): string[] {
  const counts = new Map<string, number>();
  catalog.forEach((item) => {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  });
  return Array.from(counts.keys()).sort((a, b) => a.localeCompare(b, 'tr'));
}

export function getBrowseCategoryOptions(catalog: ServiceCatalogEntry[]) {
  return BROWSE_CATEGORIES.map((browse) => ({
    id: browse.id,
    label: browse.label,
    description: browse.description,
    count: countBrowseCategory(catalog, browse.id),
  }));
}

export function resolveBrowseHeading(categoryParam: string | null): string {
  if (!categoryParam || categoryParam === 'Tümü') return 'Departman ajanlarını keşfet';
  const browse = getBrowseCategory(categoryParam);
  if (browse) return `${browse.label} çözümleri`;
  return `${categoryParam} çözümleri`;
}

export function getCachedFullCatalog(): ServiceCatalogEntry[] {
  return getFullCatalog();
}

export type { BrowseCategory };
