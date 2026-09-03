import Link from 'next/link';
import { Suspense } from 'react';
import { Check } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import ServiceDetailActions from '../../../app/service/[slug]/ServiceDetailActions';
import type { MarketplaceProduct } from '@/lib/marketplace';
import { breadcrumbJsonLd, softwareApplicationJsonLd } from '@/lib/seo';
import VerifiedBadge from '@/components/VerifiedBadge';
import ServicePromoVisual from '@/components/services/ServicePromoVisual';

export default function MarketplaceDetail({ product }: { product: MarketplaceProduct }) {
  const listing = product.listing;
  const faqs = (listing?.faqs || []).filter((f) => f.question.trim() && f.answer.trim());
  const gallery = product.gallery.filter(Boolean);
  const useCases = (listing?.tldr || []).filter(Boolean);
  const icon = product.iconImage || product.coverImage || 'marketplace';

  return (
    <main className="min-h-screen bg-transparent pb-24">
      <JsonLd
        data={[
          softwareApplicationJsonLd({
            name: product.title,
            description: product.shortDescription,
            slug: product.slug,
            category: product.category,
          }),
          breadcrumbJsonLd([
            { name: 'Ana sayfa', path: '/' },
            { name: 'Servisler', path: '/services' },
            { name: product.title, path: `/service/${product.slug}` },
          ]),
        ]}
      />

      <ServicePromoVisual
        name={product.title}
        slug={product.slug}
        description={product.shortDescription}
        category={product.category}
        brandColor={product.brandColor || '#71717a'}
        icon={icon}
        features={product.features}
        eyebrow={`${product.verified ? 'Blacknook' : 'Partner'} · ${product.category}`}
        badge={product.verified ? <VerifiedBadge /> : null}
        coverSrc={product.coverImage || null}
        coverAlt={listing?.heroAlt || product.title}
      />

      <div className="mx-auto max-w-6xl px-6 pt-8">
        <nav className="mb-10 text-sm text-zinc-500" aria-label="Sayfa konumu">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-zinc-300">
                Ana sayfa
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/services" className="hover:text-zinc-300">
                Servisler
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-zinc-300">{product.title}</li>
          </ol>
        </nav>

        <div className="flex flex-col gap-14 lg:flex-row lg:gap-16">
          <div className="w-full space-y-12 lg:w-[62%]">
            {product.longDescription ? (
              <section>
                <h2 className="mb-4 font-display text-2xl font-semibold text-white">Genel bakış</h2>
                <p className="leading-relaxed text-zinc-400">{product.longDescription}</p>
              </section>
            ) : null}

            {product.features.length ? (
              <section>
                <h2 className="mb-6 font-display text-2xl font-semibold text-white">
                  Öne çıkan özellikler
                </h2>
                <ul className="space-y-3">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 py-1">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
                      <span className="text-sm leading-relaxed text-zinc-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {useCases.length ? (
              <section>
                <h2 className="mb-6 font-display text-2xl font-semibold text-white">
                  Kullanım senaryoları
                </h2>
                <ul className="space-y-4">
                  {useCases.map((useCase) => (
                    <li
                      key={useCase}
                      className="border-l border-white/15 pl-5 leading-relaxed text-zinc-400"
                    >
                      {useCase}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {gallery.length ? (
              <section>
                <h2 className="mb-6 font-display text-2xl font-semibold text-white">Görseller</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {gallery.map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={src}
                      src={src}
                      alt=""
                      className="w-full rounded-xl border border-white/10 object-cover"
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {listing?.founderNarrative ? (
              <section>
                <h2 className="mb-4 font-display text-2xl font-semibold text-white">
                  {listing.storyHeadline || 'Kurucu hikâyesi'}
                </h2>
                <p className="leading-relaxed text-zinc-400">{listing.founderNarrative}</p>
                {listing.founderName ? (
                  <p className="mt-3 text-sm text-zinc-500">
                    {listing.founderName}
                    {listing.founderRole ? ` · ${listing.founderRole}` : ''}
                  </p>
                ) : null}
              </section>
            ) : null}

            {faqs.length ? (
              <section>
                <h2 className="mb-6 font-display text-2xl font-semibold text-white">SSS</h2>
                <dl className="space-y-6">
                  {faqs.map((faq) => (
                    <div key={faq.id}>
                      <dt className="font-medium text-zinc-100">{faq.question}</dt>
                      <dd className="mt-1 text-sm leading-relaxed text-zinc-500">{faq.answer}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}
          </div>

          <aside className="w-full lg:w-[38%]">
            <div className="sticky top-24 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
              <h2 className="mb-3 font-display text-lg font-semibold text-white">
                Projeye entegre et
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-zinc-500">
                {product.title} ürününü Blacknook üzerinden projenize ekleyin.
              </p>
              <Suspense fallback={null}>
                <ServiceDetailActions serviceName={product.title} serviceSlug={product.slug} />
              </Suspense>

              {product.tiers.length ? (
                <ul className="mt-6 space-y-2 border-t border-white/[0.08] pt-5">
                  {product.tiers.map((tier) => (
                    <li key={String(tier.id)} className="flex justify-between text-sm">
                      <span className="text-zinc-400">{tier.name}</span>
                      <span className="font-medium text-zinc-100">${tier.price}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <dl className="mt-8 space-y-4 border-t border-white/[0.08] pt-6 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">Kategori</dt>
                  <dd className="text-right font-medium text-zinc-200">{product.category}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-zinc-500">Sağlayıcı</dt>
                  <dd className="flex items-center justify-end gap-1.5 text-right font-medium text-zinc-200">
                    <span>{product.vendorName}</span>
                    {product.verified ? <VerifiedBadge compact /> : null}
                  </dd>
                </div>
                {listing?.delivery ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500">Çalışır</dt>
                    <dd className="text-right font-medium text-zinc-200">
                      {listing.delivery === 'self-host'
                        ? 'Kendi sunucunuzda'
                        : listing.delivery === 'saas'
                          ? 'Bizim sunucumuzda'
                          : listing.delivery === 'both'
                            ? 'İkisi de'
                            : listing.delivery}
                    </dd>
                  </div>
                ) : null}
                {listing?.websiteUrl ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500">Site</dt>
                    <dd className="text-right">
                      <a
                        href={listing.websiteUrl}
                        className="font-medium text-sky-400 hover:text-sky-300"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Aç
                      </a>
                    </dd>
                  </div>
                ) : null}
                {listing?.docsUrl ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500">Dokümantasyon</dt>
                    <dd className="text-right">
                      <a
                        href={listing.docsUrl}
                        className="font-medium text-sky-400 hover:text-sky-300"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Aç
                      </a>
                    </dd>
                  </div>
                ) : null}
                {listing?.supportEmail ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500">Destek</dt>
                    <dd className="text-right">
                      <a
                        href={`mailto:${listing.supportEmail}`}
                        className="font-medium text-sky-400 hover:text-sky-300"
                      >
                        {listing.supportEmail}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
