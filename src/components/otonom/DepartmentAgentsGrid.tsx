'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import SimulationLaunchButton from '@/components/simulations/SimulationLaunchButton';
import {
  listDepartmentServices,
  type DepartmentService,
} from '@/lib/otonom/departmentServices';
import type { DepartmentSlug } from '@/lib/otonom/catalog';

const cardClass =
  'group flex min-h-[12rem] w-full flex-col items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-left transition-[border-color,background-color,transform] duration-premium ease-premium hover:border-white/15 hover:bg-white/[0.05] active:scale-[0.99]';

const detailButtonClass =
  'mt-auto inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white';

export default function DepartmentAgentsGrid({ department }: { department: DepartmentSlug }) {
  const services = useMemo(() => listDepartmentServices(department), [department]);

  if (services.length === 0) {
    return (
      <p className="text-center text-sm text-[var(--bn-subtitle)]">
        Bu departmanda henüz uygulama yok.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {services.map((service) => (
        <DepartmentServiceCard key={service.slug} service={service} />
      ))}
    </div>
  );
}

function DepartmentServiceCard({ service }: { service: DepartmentService }) {
  const content = (
    <>
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10"
        style={{ backgroundColor: `${service.brandColor}18` }}
      >
        <ServiceCatalogLogo
          icon={service.icon}
          brandColor={service.brandColor}
          name={service.name}
          size="md"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-base font-bold text-[var(--bn-heading)]">{service.name}</p>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-2">
        <Link href={service.href} className={detailButtonClass}>
          Detay
        </Link>
        {service.simulationPath ? (
          <SimulationLaunchButton
            href={service.simulationPath}
            label=""
            splashLabel={service.splashLabel}
            aria-label="Simülasyon"
            className="inline-flex h-[2.125rem] w-[2.125rem] items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-500/10 text-emerald-300 transition-colors hover:border-emerald-400/45 hover:bg-emerald-500/20 hover:text-emerald-200"
          />
        ) : null}
      </div>
    </>
  );

  if (service.simulationPath) {
    return <div className={cardClass}>{content}</div>;
  }

  return (
    <Link href={service.href} className={cardClass}>
      {content}
    </Link>
  );
}
