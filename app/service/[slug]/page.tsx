import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import { getAllServiceSlugs, getServiceBySlug } from '../../../lib/data';
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  softwareApplicationJsonLd,
} from '@/lib/seo';
import ServiceDetailActions from './ServiceDetailActions';
import MarketplaceDetail from '@/components/services/MarketplaceDetail';
import ServicePromoVisual from '@/components/services/ServicePromoVisual';
import { getMarketplaceBySlug } from '@/lib/marketplace';
import { ensureCriticalSchema } from '@/lib/ensureSchema';

type PageProps = {
  params: { slug: string };
};

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await ensureCriticalSchema().catch(() => undefined);
  const market = await getMarketplaceBySlug(params.slug, { includeUnlisted: true }).catch(() => null);
  if (market?.status === 'approved') {
    return buildPageMetadata({
      title: `${market.title} | Blacknook`.slice(0, 60),
      description: market.shortDescription,
      path: `/service/${market.slug}`,
    });
  }
  if (market) {
    return buildPageMetadata({
      title: 'Servis bulunamadı',
      description: 'Aradığınız servis Blacknook kataloğunda yok.',
      path: `/service/${params.slug}`,
      noIndex: true,
    });
  }

  const service = getServiceBySlug(params.slug);
  if (!service) {
    return buildPageMetadata({
      title: 'Servis bulunamadı',
      description: 'Aradığınız servis Blacknook kataloğunda yok.',
      path: `/service/${params.slug}`,
      noIndex: true,
    });
  }

  const title = `${service.name} | Blacknook`.slice(0, 60);
  return buildPageMetadata({
    title,
    description: service.description,
    path: `/service/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  await ensureCriticalSchema().catch(() => undefined);
  const market = await getMarketplaceBySlug(params.slug, { includeUnlisted: true }).catch(() => null);
  if (market) {
    if (market.status !== 'approved') notFound();
    return <MarketplaceDetail product={market} />;
  }

  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  return (
    <main className="min-h-screen bg-transparent pb-24">
      <JsonLd
        data={[
          softwareApplicationJsonLd({
            name: service.name,
            description: service.description,
            slug: service.slug,
            category: service.category,
          }),
          breadcrumbJsonLd([
            { name: 'Ana sayfa', path: '/' },
            { name: 'Servisler', path: '/services' },
            { name: service.name, path: `/service/${service.slug}` },
          ]),
        ]}
      />

      <ServicePromoVisual
        name={service.name}
        slug={service.slug}
        description={service.description}
        category={service.category}
        brandColor={service.brandColor}
        icon={service.icon}
        features={service.features}
        badge={
          <span
            className="inline-flex items-center rounded-full bg-sky-500/15 p-1.5 text-sky-300 ring-1 ring-sky-400/30"
            title="Doğrulanmış"
            aria-label="Doğrulanmış"
          >
            <Check className="h-3.5 w-3.5" aria-hidden />
          </span>
        }
      />

      <div className="mx-auto max-w-6xl px-6 pt-8">
        <nav className="mb-10 text-sm text-zinc-500" aria-label="Sayfa konumu">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href="/"
                className="transition-colors duration-premium ease-premium hover:text-zinc-300"
              >
                Ana sayfa
              </Link>
            </li>
            <li aria-hidden className="text-zinc-700">
              /
            </li>
            <li>
              <Link
                href="/services"
                className="transition-colors duration-premium ease-premium hover:text-zinc-300"
              >
                Servisler
              </Link>
            </li>
            <li aria-hidden className="text-zinc-700">
              /
            </li>
            <li className="text-zinc-300" aria-current="page">
              {service.name}
            </li>
          </ol>
        </nav>

        <div className="flex flex-col gap-14 lg:flex-row lg:gap-16">
          <div className="w-full space-y-12 lg:w-[62%]">
            <section aria-labelledby="overview-heading">
              <h2 id="overview-heading" className="mb-4 font-display text-2xl font-semibold text-white">
                Genel bakış
              </h2>
              <p className="leading-relaxed text-zinc-400">{service.about}</p>
            </section>

            <section aria-labelledby="features-heading">
              <h2 id="features-heading" className="mb-6 font-display text-2xl font-semibold text-white">
                Öne çıkan özellikler
              </h2>
              <ul className="space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 py-1">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <span className="text-sm leading-relaxed text-zinc-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="usecases-heading">
              <h2 id="usecases-heading" className="mb-6 font-display text-2xl font-semibold text-white">
                Kullanım senaryoları
              </h2>
              <ul className="space-y-4">
                {service.useCases.map((useCase) => (
                  <li
                    key={useCase}
                    className="border-l border-white/15 pl-5 leading-relaxed text-zinc-400"
                  >
                    {useCase}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="w-full lg:w-[38%]" aria-labelledby="integrate-heading">
            <div className="sticky top-24 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
              <h2 id="integrate-heading" className="mb-3 font-display text-lg font-semibold text-white">
                Projeye entegre et
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-zinc-500">
                {service.name} servisini Blacknook üzerinden projenize ekleyin.
              </p>
              <Suspense fallback={null}>
                <ServiceDetailActions
                  serviceName={service.name}
                  serviceSlug={service.slug}
                  demoUrl={service.demoUrl}
                />
              </Suspense>

              <dl className="mt-8 space-y-4 border-t border-white/[0.08] pt-6 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">Kategori</dt>
                  <dd className="text-right font-medium text-zinc-200">{service.category}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-zinc-500">Sağlayıcı</dt>
                  <dd className="flex items-center gap-1.5 font-medium text-zinc-200">
                    <span>BlackNook</span>
                    <span title="Doğrulanmış" aria-label="Doğrulanmış" className="inline-flex">
                      <Check className="h-4 w-4 text-sky-300" aria-hidden />
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
