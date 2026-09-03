'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import SimulationLaunchButton from '@/components/simulations/SimulationLaunchButton';
import SubheadingFilterChips from '@/components/services/SubheadingFilterChips';
import {
  filterDepartmentBySubheading,
  getDepartmentSubheadingOptions,
} from '../../../lib/catalogSubheadings';
import {
  listDepartmentServices,
  type DepartmentService,
} from '@/lib/otonom/departmentServices';
import type { DepartmentSlug } from '@/lib/otonom/catalog';
import { getFullCatalog } from '../../../lib/data';
import { cn } from '@/lib/utils';

const cardClass =
  'group flex min-h-[12rem] w-full flex-col items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-left transition-[border-color,background-color,transform] duration-premium ease-premium hover:border-white/15 hover:bg-white/[0.05] active:scale-[0.99]';

const detailButtonClass =
  'mt-auto inline-flex items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white';

export default function DepartmentAgentsGrid({ department }: { department: DepartmentSlug }) {
  const searchParams = useSearchParams();
  const subFromUrl = searchParams.get('sub');
  const [localSub, setLocalSub] = useState<string | null>(null);
  const [subheadingsOpen, setSubheadingsOpen] = useState(false);
  const activeSub = subFromUrl ?? localSub;

  const allServices = listDepartmentServices(department);
  const catalogBySlug = useMemo(() => new Map(getFullCatalog().map((item) => [item.slug, item])), []);

  const catalogItems = useMemo(
    () =>
      allServices
        .map((service) => catalogBySlug.get(service.slug))
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [allServices, catalogBySlug]
  );

  const subheadingOptions = useMemo(
    () => getDepartmentSubheadingOptions(department, catalogItems),
    [catalogItems, department]
  );

  const filteredSlugs = useMemo(() => {
    const filteredCatalog = filterDepartmentBySubheading(catalogItems, department, activeSub);
    const slugSet = new Set(filteredCatalog.map((item) => item.slug));
    return allServices.filter((service) => slugSet.has(service.slug));
  }, [activeSub, allServices, catalogItems, department]);

  const activeSubLabel = subheadingOptions.find((item) => item.id === activeSub)?.label;

  if (allServices.length === 0) {
    return (
      <p className="text-center text-sm text-[var(--bn-subtitle)]">
        Bu departmanda henüz uygulama yok.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {subheadingOptions.length > 0 ? (
        <div>
          <button
            type="button"
            onClick={() => setSubheadingsOpen((open) => !open)}
            aria-expanded={subheadingsOpen}
            className="flex w-full items-center justify-between gap-2 rounded-lg px-1 py-1.5 text-left transition-colors hover:bg-white/[0.04]"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Alt başlıklar
              </span>
              {!subheadingsOpen && activeSubLabel ? (
                <span className="truncate rounded-full border border-sky-400/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-200">
                  {activeSubLabel}
                </span>
              ) : null}
            </span>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 shrink-0 text-zinc-500 transition-transform duration-premium',
                subheadingsOpen && 'rotate-180'
              )}
              aria-hidden
            />
          </button>
          {subheadingsOpen ? (
            <div className="mt-2">
              <SubheadingFilterChips
                options={subheadingOptions}
                activeId={activeSub}
                onChange={setLocalSub}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {filteredSlugs.length === 0 ? (
        <p className="text-center text-sm text-[var(--bn-subtitle)]">
          Bu alt başlıkta uygulama bulunamadı.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredSlugs.map((service) => (
            <DepartmentServiceCard key={service.slug} service={service} />
          ))}
        </div>
      )}
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
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--bn-subtitle)]">
          {service.description}
        </p>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-2">
        <Link href={service.href} className={detailButtonClass}>
          Detay
        </Link>
        {service.simulationPath ? (
          <SimulationLaunchButton
            href={service.simulationPath}
            label="Simülasyon"
            splashLabel={service.splashLabel}
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
