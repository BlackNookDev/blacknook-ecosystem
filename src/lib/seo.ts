import type { Metadata } from 'next';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://blacknook.com').replace(
  /\/$/,
  ''
);

export const SITE_NAME = 'Blacknook';

export const SITE_TAGLINE = 'Kurumsal otonomi paneli';

export const DEFAULT_TITLE = 'Blacknook — Keşfet, kur, işlet';

/** max ~155–160 chars */
export const DEFAULT_DESCRIPTION =
  'Departman ajanlarını ve MCP’leri tek kokpitte çalıştırın. Katalogdan keşfedin, yönetilen kurulum talep edin, /agent panelinde işletin.';

export const OG_IMAGE = `${SITE_URL}/og.png`;
export const FAVICON_48 = `${SITE_URL}/favicon-48.png`;
export const FAVICON_192 = `${SITE_URL}/favicon-192.png`;

export function absoluteUrl(path = '/') {
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

type BuildMetaInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
};

/** Title ≤60, description ≤160; OG + Twitter + canonical */
export function buildPageMetadata({
  title,
  description,
  path = '/',
  image = OG_IMAGE,
  type = 'website',
  noIndex = false,
}: BuildMetaInput): Metadata {
  const shortTitle = title.length > 60 ? `${title.slice(0, 57)}…` : title;
  const shortDesc =
    description.length > 160 ? `${description.slice(0, 157)}…` : description;
  const url = absoluteUrl(path);

  return {
    title: { absolute: shortTitle },
    description: shortDesc,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type,
      locale: 'tr_TR',
      url,
      siteName: SITE_NAME,
      title: shortTitle,
      description: shortDesc,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: shortTitle,
      description: shortDesc,
      images: [image],
    },
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: ['BlackNOOK', SITE_TAGLINE],
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'tr-TR',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/services?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: 'BlackNOOK',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: FAVICON_192,
      width: 192,
      height: 192,
    },
    image: FAVICON_192,
    email: 'contact@blacknook.com',
    sameAs: [],
  };
}

export function softwareApplicationJsonLd(input: {
  name: string;
  description: string;
  slug: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: input.name,
    description: input.description,
    url: absoluteUrl(`/service/${input.slug}`),
    applicationCategory: input.category || 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'TRY',
      availability: 'https://schema.org/InStock',
    },
    provider: {
      '@type': 'Organization',
      name: 'Blacknook',
      url: SITE_URL,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  datePublished?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    datePublished: input.datePublished || '2026-01-01',
    author: {
      '@type': 'Organization',
      name: 'Blacknook',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Blacknook',
      logo: {
        '@type': 'ImageObject',
        url: OG_IMAGE,
      },
    },
    inLanguage: 'tr-TR',
  };
}

/** Ana sayfa + ekosistem alt kategorileri — Google sitelink ipuçları */
export function ecosystemNavigationJsonLd(
  links: { name: string; path: string; description: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Blacknook Ekosistem Kategorileri',
    itemListElement: links.map((link, index) => ({
      '@type': 'SiteNavigationElement',
      position: index + 1,
      name: link.name,
      description: link.description,
      url: absoluteUrl(link.path),
    })),
  };
}
