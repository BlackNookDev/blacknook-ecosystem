import type { ServiceCatalogEntry } from '../../lib/data';
import type { AppLocale } from '@/lib/locale';
import type { TranslateFn } from '@/lib/i18n';

export function translateCategory(category: string, t: TranslateFn) {
  return t(`catalog.categories.${category}`, { defaultValue: category });
}

export function localizeService(
  service: ServiceCatalogEntry,
  locale: AppLocale,
  t: TranslateFn
): ServiceCatalogEntry {
  const category = translateCategory(service.category, t);

  if (locale === 'tr') {
    return service;
  }

  const localizedDescription = t(`catalog.services.${service.slug}.description`, {
    defaultValue: '',
  });

  const description =
    localizedDescription ||
    t('catalog.fallbackDescription', {
      name: service.name,
      category,
    });

  return {
    ...service,
    category,
    description,
  };
}
