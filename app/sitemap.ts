import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getAllServiceSlugs } from '../lib/data';
import { HELP_CATEGORIES } from '../lib/helpCenter';
import { ECOSYSTEM_SITELINKS } from '../lib/siteNavigationSeo';

/** Yalnızca resmi katalog (hero + MCP). DB marketplace ürünleri sitemap’e alınmaz. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/services',
    '/about',
    '/careers',
    '/learn/online-isletme',
    '/learn/creator-economy',
    '/help',
    '/terms',
    '/privacy',
    '/agent',
  ].map((path) => ({
    url: `${SITE_URL}${path || '/'}`,
    lastModified: now,
    changeFrequency: path === '' || path === '/services' ? 'daily' : 'weekly',
    priority:
      path === ''
        ? 1
        : path === '/services' || path === '/agent' || path === '/careers'
          ? 0.9
          : 0.7,
  }));

  const ecosystemCategoryRoutes: MetadataRoute.Sitemap = ECOSYSTEM_SITELINKS.map((link) => ({
    url: `${SITE_URL}${link.path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const helpRoutes: MetadataRoute.Sitemap = HELP_CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/help/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = getAllServiceSlugs().map((slug) => ({
    url: `${SITE_URL}/service/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...ecosystemCategoryRoutes, ...helpRoutes, ...serviceRoutes];
}
