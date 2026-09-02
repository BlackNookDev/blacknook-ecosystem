'use client';

import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import VerifiedBadge from '@/components/VerifiedBadge';
import type { ServiceCatalogEntry } from '../../../lib/data';
import { cn } from '@/lib/utils';

type Props = {
  service: ServiceCatalogEntry;
  className?: string;
};

/** Servis kartı: logo · isim · kategori · kısa açıklama */
export default function BrowseProductCard({ service, className }: Props) {
  const { theme } = useTheme();
  const icon = service.iconImage || service.icon;
  const cover = service.coverImage;
  const hasPhoto = Boolean(cover && cover !== icon);
  const gradientEnd = theme === 'light' ? 'var(--bn-card-bg-solid)' : '#121214';

  return (
    <Link
      href={`/service/${service.slug}`}
      aria-label={`${service.name}, ${service.category}`}
      className={cn(
        'group bn-card-solid flex flex-col overflow-hidden rounded-xl transition-[border-color,transform,box-shadow] duration-premium ease-premium',
        'hover:-translate-y-0.5 hover:border-[var(--bn-border-strong)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bn-border-strong)]',
        className
      )}
    >
      <div
        className="relative aspect-[16/10] overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${service.brandColor || '#6366F1'}aa 0%, ${gradientEnd} 70%)`,
        }}
      >
        {hasPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            <div
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22), transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1), transparent 40%)',
              }}
              aria-hidden
            />
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <ServiceCatalogLogo
                icon={icon}
                brandColor={service.brandColor}
                name={service.name}
                size="lg"
                framed
                frameClassName="shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-transform duration-premium group-hover:scale-105"
              />
            </div>
          </>
        )}
        {service.verified ? (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-sky-500/20 p-1 ring-1 ring-sky-400/30">
            <VerifiedBadge compact className="text-sky-200" />
          </span>
        ) : service.source === 'marketplace' ? (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
            Partner
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3.5">
        <h3 className="bn-heading truncate font-display text-[15px] font-bold leading-tight tracking-tight">
          {service.name}
        </h3>
        <p className="bn-subtitle mt-0.5 text-[12px]">{service.category}</p>

        <p className="bn-subtitle mt-2 line-clamp-2 flex-1 text-[13px] leading-snug">
          {service.description}
        </p>

        <p className="bn-link-accent mt-3 text-[12px] font-medium">Keşfet →</p>
      </div>
    </Link>
  );
}
