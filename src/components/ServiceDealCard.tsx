'use client';

import Link from 'next/link';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import VerifiedBadge from '@/components/VerifiedBadge';
import type { ServiceCatalogEntry } from '../../lib/data';
import { cn } from '@/lib/utils';

type Props = {
  service: ServiceCatalogEntry;
  index: number;
  className?: string;
};

export default function ServiceDealCard({ service, className }: Props) {
  const icon = service.iconImage || service.icon;

  return (
    <Link
      href={`/service/${service.slug}`}
      aria-label={`${service.name} servis detayı`}
      className={cn(
        'group relative flex gap-4 rounded-xl p-3 text-left transition-colors duration-premium ease-premium',
        'hover:bg-[var(--bn-hover-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--bn-border-strong)]',
        className
      )}
    >
      <div className="relative z-10 flex w-14 shrink-0 flex-col items-center gap-2 pt-1">
        <ServiceCatalogLogo
          icon={icon}
          brandColor={service.brandColor}
          name={service.name}
          size="md"
          framed
        />
      </div>

      <div className="relative z-10 min-w-0 flex-1 pt-0.5">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="bn-heading truncate text-[15px] font-bold">
            {service.name}
          </h3>
          {service.verified ? <VerifiedBadge compact className="shrink-0 text-sky-300" /> : null}
        </div>

        <p className="mt-2 text-sm">
          <span className="bn-link-accent font-medium">Keşfet →</span>
        </p>
      </div>
    </Link>
  );
}
