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
  getFullCatalog,
} from '../../lib/data';

export default function ServiceGrid() {
  const { t: th } = useTranslations('home');
  const heroAgents = useMemo(() => getHeroAgents(), []);
  const mcpAgents = useMemo(() => getFeaturedMcpAgents(6), []);
  const totalAgents = useMemo(() => getFullCatalog().length, []);

  return (
    <div id="service-grid" className="relative w-full pb-20 pt-8 md:pb-28 md:pt-12">
      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 md:gap-20">
        <section className="w-full" aria-labelledby="hero-agents-heading">
          <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
            <div>
              <h2
                id="hero-agents-heading"
                className="bn-heading font-display text-2xl font-bold tracking-tight md:text-3xl"
              >
                {th('heroAgents.title')}
              </h2>
              <p className="bn-subtitle mt-1 text-sm">{th('heroAgents.subtitle')}</p>
            </div>
            <Link
              href="/agent"
              className="bn-subtitle inline-flex shrink-0 items-center gap-1.5 text-sm font-medium transition-colors hover:text-[var(--bn-heading)]"
            >
              {th('openCockpit')}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <div className="grid w-full grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {heroAgents.map((agent) => (
              <BrowseProductCard key={agent.slug} service={agent} />
            ))}
          </div>
        </section>

        <section className="w-full" aria-labelledby="mcp-agents-heading">
          <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
            <div>
              <h2
                id="mcp-agents-heading"
                className="bn-heading font-display text-2xl font-bold tracking-tight md:text-3xl"
              >
                {th('mcpAgents.title')}
              </h2>
              <p className="bn-subtitle mt-1 text-sm">
                {th('mcpAgents.subtitle', { count: String(totalAgents) })}
              </p>
            </div>
            <Link
              href="/services"
              className="bn-subtitle inline-flex shrink-0 items-center gap-1.5 text-sm font-medium transition-colors hover:text-[var(--bn-heading)]"
            >
              {th('mcpAgents.more')}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
          <div className="grid w-full grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mcpAgents.map((agent) => (
              <BrowseProductCard key={agent.slug} service={asOfficialCatalog(agent)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
