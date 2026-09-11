'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BrowseProductCard from '@/components/services/BrowseProductCard';
import { useTranslations } from '@/components/LocaleProvider';
import {
  asOfficialCatalog,
  getFeaturedMcpAgents,
  getHeroAgents,
} from '../../lib/data';

export default function ServiceGrid() {
  const { t: th } = useTranslations('home');
  const heroAgents = useMemo(() => getHeroAgents(), []);
  const mcpAgents = useMemo(() => getFeaturedMcpAgents(17), []);
  const allAgents = useMemo(
    () => [...heroAgents, ...mcpAgents.map(asOfficialCatalog)],
    [heroAgents, mcpAgents]
  );

  return (
    <div id="service-grid" className="relative w-full pb-20 pt-8 md:pb-28 md:pt-12">
      <div className="relative mx-auto max-w-6xl px-6">
        <section className="w-full" aria-labelledby="agents-heading">
          <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
            <h2
              id="agents-heading"
              className="bn-heading font-display text-2xl font-bold tracking-tight md:text-3xl"
            >
              {th('agents.title')}
            </h2>
            <Link
              href="/services"
              className="bn-subtitle inline-flex shrink-0 items-center gap-1.5 text-sm font-medium transition-colors hover:text-[var(--bn-heading)]"
            >
              {th('agents.more')}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <div className="grid w-full grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allAgents.map((agent) => (
              <BrowseProductCard key={agent.slug} service={agent} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
