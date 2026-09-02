'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BrowseProductCard from '@/components/services/BrowseProductCard';
import ServiceDealCard from '@/components/ServiceDealCard';
import { useLocale, useTranslations } from '@/components/LocaleProvider';
import { localizeService } from '@/lib/localizeCatalog';
import { getFeaturedServices, SERVICES, asOfficialCatalog, type ServiceCatalogEntry } from '../../lib/data';
import { apiFetch } from '@/lib/apiUrl';

const CATALOG = getFeaturedServices(9);

type Group = {
  id: string;
  title: string;
  href: string;
  moreLabel: string;
  items: ServiceCatalogEntry[];
  featured?: boolean;
};

function ServiceGroup({ title, href, moreLabel, items, featured }: Group) {
  if (!items.length) return null;

  return (
    <section className="w-full" aria-labelledby={`${title}-heading`}>
      <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
        <h2
          id={`${title}-heading`}
          className="bn-heading font-display text-2xl font-bold tracking-tight md:text-3xl"
        >
          {title}
        </h2>
        <Link
          href={href}
          className="bn-subtitle inline-flex shrink-0 items-center gap-1.5 text-sm font-medium transition-colors hover:text-[var(--bn-heading)]"
        >
          {moreLabel}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      {featured ? (
        <ul className="grid w-full grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service) => (
            <li key={service.slug} className="min-w-0">
              <BrowseProductCard service={service} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid w-full grid-cols-1 items-start gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service, index) => (
            <li key={service.slug} className="min-w-0">
              <ServiceDealCard service={service} index={index} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function ServiceGrid() {
  const [market, setMarket] = useState<ServiceCatalogEntry[]>([]);
  const { t, locale } = useLocale();
  const { t: th } = useTranslations('home');

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

  const groups = useMemo<Group[]>(() => {
    const marketSlugs = new Set(market.map((item) => item.slug));
    const catalogSaas = SERVICES.filter(
      (item) => item.listingType === 'saas' && !marketSlugs.has(item.slug)
    ).map(asOfficialCatalog);
    const catalogMicro = SERVICES.filter(
      (item) => item.listingType === 'micro-saas' && !marketSlugs.has(item.slug)
    ).map(asOfficialCatalog);

    const services = market.filter((item) => item.listingType === 'service').slice(0, 9);
    const saas = [...market.filter((item) => item.listingType === 'saas'), ...catalogSaas].slice(
      0,
      9
    );
    const micro = [
      ...market.filter((item) => item.listingType === 'micro-saas'),
      ...catalogMicro,
    ].slice(0, 6);

    return [
      {
        id: 'saas',
        title: th('groups.saas.title'),
        href: '/services?type=saas',
        moreLabel: th('groups.saas.more'),
        items: saas.map((item) => localizeService(item, locale, t)),
        featured: true,
      },
      {
        id: 'micro-saas',
        title: th('groups.microSaas.title'),
        href: '/services?type=micro-saas',
        moreLabel: th('groups.microSaas.more'),
        items: micro.map((item) => localizeService(item, locale, t)),
        featured: true,
      },
      {
        id: 'services',
        title: th('groups.services.title'),
        href: '/services',
        moreLabel: th('groups.services.more'),
        items: (services.length ? services : CATALOG).map((item) =>
          localizeService(item, locale, t)
        ),
      },
    ];
  }, [market, locale, t, th]);

  return (
    <div id="service-grid" className="relative w-full pb-20 pt-8 md:pb-28 md:pt-12">
      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 md:gap-20">
        {groups.map((group) => (
          <ServiceGroup key={group.id} {...group} />
        ))}
      </div>
    </div>
  );
}
