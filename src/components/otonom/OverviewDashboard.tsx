'use client';

import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import { formatTokenCount, type AgentDashboardStats } from '@/lib/otonom/mockData';

const STATUS_DOT = {
  running: 'bg-sky-400',
  waiting: 'bg-emerald-400',
  idle: 'bg-zinc-500',
} as const;

export default function OverviewDashboard({ stats }: { stats: AgentDashboardStats }) {
  const reduce = useReducedMotion();
  const maxTokens = Math.max(...stats.weekTokens.map((point) => point.value), 1);
  const tokenUsagePercent = Math.round((stats.tokensUsedToday / stats.tokenBudgetDaily) * 100);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--bn-heading)] md:text-3xl">
          Genel bakış
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi label="Verimlilik" value={`%${stats.efficiencyGainPercent}`} />
        <Kpi label="Token" value={formatTokenCount(stats.tokensUsedToday)} />
        <Kpi label="Maliyet" value={`$${stats.tokenCostToday.toFixed(2)}`} />
        <Kpi label="Uygulamalar" value={stats.activeAgents} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <section className="bn-card-solid rounded-2xl p-5 xl:col-span-3">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-[15px] font-bold text-[var(--bn-heading)]">
              Token kullanımı
            </h2>
            <p className="font-display text-2xl font-bold tracking-tight text-[var(--bn-heading)]">
              {formatTokenCount(stats.weekTokens.reduce((sum, point) => sum + point.value, 0))}
            </p>
          </div>
          <TokenChart points={stats.weekTokens} max={maxTokens} reduce={Boolean(reduce)} />
        </section>

        <section className="bn-card-solid rounded-2xl p-5 xl:col-span-2">
          <h2 className="font-display text-[15px] font-bold text-[var(--bn-heading)]">
            Günlük limit
          </h2>
          <p className="mt-2 font-display text-xl font-bold tracking-tight text-[var(--bn-heading)]">
            {formatTokenCount(stats.tokensUsedToday)} / {formatTokenCount(stats.tokenBudgetDaily)}
          </p>
          <div className="mt-4">
            <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-violet-400/90 transition-[width] duration-500"
                style={{ width: `${Math.min(tokenUsagePercent, 100)}%` }}
              />
            </div>
          </div>
          <ul className="mt-5 space-y-2">
            {stats.departments
              .filter((row) => row.agentCount > 0)
              .map((row) => {
                const pct = Math.round((row.tokensToday / row.tokenBudgetDaily) * 100);
                return (
                  <li key={row.slug} className="flex items-center justify-between gap-3 text-sm">
                    <Link
                      href={`/agent/departments/${row.slug}`}
                      className="text-zinc-200 hover:text-white"
                    >
                      {row.name}
                    </Link>
                    <span className="text-[var(--bn-faint)]">
                      {formatTokenCount(row.tokensToday)} · %{pct}
                    </span>
                  </li>
                );
              })}
          </ul>
        </section>
      </div>

      <section className="bn-card-solid rounded-2xl p-5">
        <h2 className="font-display text-[15px] font-bold text-[var(--bn-heading)]">
          Ekosistem uygulamaları
        </h2>
        <ul className="mt-4 divide-y divide-white/10">
          {stats.agents.map((agent) => (
            <li
              key={agent.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <Link href={agent.href} className="flex min-w-0 flex-1 items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10"
                  style={{ backgroundColor: `${agent.brandColor}18` }}
                >
                  <ServiceCatalogLogo
                    icon={agent.icon}
                    brandColor={agent.brandColor}
                    name={agent.name}
                    size="sm"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-zinc-100">{agent.name}</p>
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[agent.status]}`}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--bn-faint)]">{agent.department}</p>
                </div>
              </Link>

              <Link
                href={agent.href}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                aria-label={`${agent.name} detay sayfası`}
              >
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="bn-card-solid rounded-xl p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--bn-faint)]">
        {label}
      </p>
      <p className="font-display mt-2 text-2xl font-bold tracking-tight text-[var(--bn-heading)] md:text-3xl">
        {value}
      </p>
    </article>
  );
}

function TokenChart({
  points,
  max,
  reduce,
}: {
  points: AgentDashboardStats['weekTokens'];
  max: number;
  reduce: boolean;
}) {
  const width = 560;
  const height = 168;
  const padX = 12;
  const padY = 16;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const step = points.length > 1 ? innerW / (points.length - 1) : innerW;

  const coords = points.map((point, index) => {
    const x = padX + index * step;
    const y = padY + innerH - (point.value / max) * innerH;
    return `${x},${y}`;
  });

  const line = coords.join(' ');
  const area = `${padX},${padY + innerH} ${line} ${padX + innerW},${padY + innerH}`;

  return (
    <div className="mt-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-40 w-full"
        role="img"
        aria-label="Token kullanımı"
      >
        <defs>
          <linearGradient id="bn-token-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((lineY) => (
          <line
            key={lineY}
            x1={padX}
            x2={width - padX}
            y1={padY + innerH * (1 - lineY)}
            y2={padY + innerH * (1 - lineY)}
            stroke="rgba(255,255,255,0.06)"
          />
        ))}
        <polygon points={area} fill="url(#bn-token-fill)" />
        <polyline
          points={line}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={reduce ? undefined : { transition: 'all 450ms cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
        {points.map((point, index) => {
          const x = padX + index * step;
          const y = padY + innerH - (point.value / max) * innerH;
          return (
            <circle
              key={point.key}
              cx={x}
              cy={y}
              r="3.5"
              fill="#18181b"
              stroke="#a78bfa"
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <div className="mt-1 grid grid-cols-7 text-center text-[11px] font-medium text-[var(--bn-faint)]">
        {points.map((point) => (
          <span key={point.key}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}
