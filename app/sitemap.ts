import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getAllServiceSlugs } from '../lib/data';
import { HELP_CATEGORIES } from '../lib/helpCenter';
import { ECOSYSTEM_SITELINKS } from '../lib/siteNavigationSeo';
import { getApprovedMarketplaceProducts } from '@/lib/marketplace';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/services',
    '/about',
    '/careers',
    '/learn/online-isletme',
    '/learn/creator-economy',
    '/sell',
    '/select',
    '/help',
    '/terms',
    '/privacy',
  ].map((path) => ({
    url: `${SITE_URL}${path || '/'}`,
    lastModified: now,
    changeFrequency: path === '' || path === '/services' ? 'daily' : 'weekly',
    priority:
      path === ''
        ? 1
        : path === '/services' || path === '/sell' || path === '/select' || path === '/careers'
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

  let marketRoutes: MetadataRoute.Sitemap = [];
  try {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return [...staticRoutes, ...ecosystemCategoryRoutes, ...helpRoutes, ...serviceRoutes];
    }
    const products = await getApprovedMarketplaceProducts();
    marketRoutes = products.map((product) => ({
      url: `${SITE_URL}/service/${product.slug}`,
      lastModified: product.createdAt ? new Date(product.createdAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));
  } catch {
    marketRoutes = [];
  }

  return [...staticRoutes, ...ecosystemCategoryRoutes, ...helpRoutes, ...marketRoutes, ...serviceRoutes];
}
