import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/favicon.ico',
        '/favicon-48.png',
        '/favicon-96.png',
        '/favicon-192.png',
        '/icon.png',
        '/apple-touch-icon.png',
        '/og.png',
      ],
      disallow: [
        '/account',
        '/admin',
        '/api/',
        '/sell',
        '/select',
        '/vendor',
        '/developers',
        '/partners',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
