'use client';

import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import { Code2, Lock } from 'lucide-react';
import type { ReactNode } from 'react';
import type { AgentDashboardStats, LiveActivity, PendingAction } from '@/lib/otonom/mockData';
import { cn } from '@/lib/utils';

export default function OverviewDashboard({ stats }: { stats: AgentDashboardStats }) {
  const reduce = useReducedMotion();
  const maxOps = Math.max(...stats.weekOperations.map((point) => point.value), 1);
  const budgetPercent = Math.round((stats.budgetUsedUsd / stats.budgetCapUsd) * 100);
  const weekTotal = stats.weekOperations.reduce((sum, point) => sum + point.value, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--bn-heading)] md:text-3xl">
          Genel bakış
        </h1>
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="Yakında"
          className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-white/10 bg-white/40 px-4 py-2.5 text-sm font-bold text-zinc-950/50"
        >
          <Code2 className="h-4 w-4" aria-hidden />
          Ajan yapılandır
          <Lock className="h-3.5 w-3.5 opacity-70" aria-hidden />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi
          label="Kurtarılan süre"
          value={`${stats.hoursSaved} Saat`}
          hint={
            stats.hoursSavedTrendPercent > 0
              ? `Geçen aya göre +%${stats.hoursSavedTrendPercent} verimlilik`
              : 'Kurulum sonrası ölçülür'
          }
        />
        <Kpi
          label="Aktif otonom ajanlar"
          value={`${stats.activeAgents} Ajan Devrede`}
          hint={
            stats.connectedSources > 0
              ? `${stats.connectedSources} bağlı veri kaynağı`
              : 'Henüz bağlı kaynak yok'
          }
        />
        <Kpi
          label="İşlenen toplam operasyon"
          value={`${stats.totalOperations.toLocaleString('tr-TR')} İşlem`}
          hint="Faturalar, biletler, randevular"
        />
        <Kpi
          label="Maliyet & bütçe"
          value={`$${stats.budgetUsedUsd.toFixed(2)} / $${stats.budgetCapUsd}`}
          hint={
            stats.budgetUsedUsd > 0
              ? `Aylık tavanın %${budgetPercent}’i kullanıldı`
              : 'Kullanım henüz başlamadı'
          }
        >
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className="h-full rounded-full bg-emerald-400/90"
              style={{ width: `${Math.min(budgetPercent, 100)}%` }}
            />
          </div>
        </Kpi>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <section className="bn-card-solid rounded-2xl p-5 xl:col-span-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-[15px] font-bold text-[var(--bn-heading)]">
                Departman işlem hacmi
              </h2>
              <p className="mt-1 text-xs text-zinc-500">Ajanların tamamladığı otomatik görevler.</p>
            </div>
            <p className="font-display text-2xl font-bold tracking-tight text-[var(--bn-heading)]">
              {weekTotal.toLocaleString('tr-TR')}
            </p>
          </div>
          {weekTotal > 0 ? (
            <OpsChart points={stats.weekOperations} max={maxOps} reduce={Boolean(reduce)} />
          ) : (
            <EmptyNote text="Henüz işlem kaydı yok. Ajan kurulumundan sonra burada görünecek." />
          )}
        </section>

        <div className="flex flex-col gap-4 xl:col-span-2">
          <section className="bn-card-solid rounded-2xl p-5">
            <h2 className="font-display text-[15px] font-bold text-[var(--bn-heading)]">
              Onay bekleyenler
            </h2>
            {stats.pendingActions.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {stats.pendingActions.map((action) => (
                  <PendingCard key={action.id} action={action} />
                ))}
              </ul>
            ) : (
              <EmptyNote text="Onay bekleyen işlem yok." className="mt-4" />
            )}
          </section>

          <section className="bn-card-solid rounded-2xl p-5">
            <h2 className="font-display text-[15px] font-bold text-[var(--bn-heading)]">
              Departman yükü
            </h2>
            {stats.departments.some((row) => row.agentCount > 0) ? (
              <ul className="mt-4 space-y-3">
                {stats.departments.map((row) => (
                  <li key={row.slug}>
                    <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                      <Link
                        href={`/agent/departments/${row.slug}`}
                        className="text-zinc-200 hover:text-white"
                      >
                        {row.name}
                      </Link>
                      <span className="text-[11px] text-zinc-500">
                        %{row.completedPercent} tamamlanan
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-sky-400/80"
                        style={{ width: `${Math.min(row.completedPercent, 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyNote text="Departmanlara ajan bağlandıkça yük görünür." className="mt-4" />
            )}
          </section>
        </div>
      </div>

      <section className="bn-card-solid rounded-2xl p-5">
        <h2 className="font-display text-[15px] font-bold text-[var(--bn-heading)]">
          Canlı ajan aktiviteleri
        </h2>
        {stats.liveActivities.length > 0 ? (
          <ul className="mt-4 divide-y divide-white/[0.06]">
            {stats.liveActivities.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </ul>
        ) : (
          <EmptyNote text="Canlı aktivite yok. Ajanlar çalışmaya başladığında akış burada listelenir." className="mt-4" />
        )}
      </section>
    </div>
  );
}

function EmptyNote({ text, className }: { text: string; className?: string }) {
  return (
    <p className={cn('rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-3 py-4 text-sm text-zinc-500', className)}>
      {text}
    </p>
  );
}

function Kpi({
  label,
  value,
  hint,
  children,
}: {
  label: string;
  value: string;
  hint: string;
  children?: ReactNode;
}) {
  return (
    <article className="bn-card-solid rounded-xl p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--bn-faint)]">
        {label}
      </p>
      <p className="font-display mt-2 text-xl font-bold tracking-tight text-[var(--bn-heading)] md:text-2xl">
        {value}
      </p>
      <p className="mt-1.5 text-[11px] leading-snug text-zinc-500">{hint}</p>
      {children}
    </article>
  );
}

function PendingCard({ action }: { action: PendingAction }) {
  return (
    <li className="rounded-xl border border-amber-400/20 bg-amber-500/[0.06] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-200/80">
        {action.department}
      </p>
      <p className="mt-1 text-sm font-medium leading-snug text-zinc-100">{action.title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-md bg-white px-2.5 py-1.5 text-[11px] font-semibold text-zinc-950"
        >
          {action.primaryLabel}
        </button>
        {action.secondaryLabel ? (
          <Link
            href={`/agent/departments/${action.departmentSlug}`}
            className="rounded-md border border-white/15 px-2.5 py-1.5 text-[11px] font-semibold text-zinc-300 hover:bg-white/[0.04]"
          >
            {action.secondaryLabel}
          </Link>
        ) : null}
      </div>
    </li>
  );
}

function ActivityRow({ item }: { item: LiveActivity }) {
  const tone =
    item.status === 'warning'
      ? 'text-amber-200'
      : item.status === 'resolved'
        ? 'text-sky-200'
        : 'text-emerald-200';

  return (
    <li className="grid grid-cols-[3rem_minmax(0,1fr)_auto] items-start gap-3 py-3 first:pt-0 last:pb-0 sm:grid-cols-[3.5rem_9rem_minmax(0,1fr)_auto] sm:items-center">
      <span className="font-mono text-xs text-zinc-500">{item.time}</span>
      <span className="hidden truncate text-sm font-medium text-zinc-200 sm:block">{item.agent}</span>
      <div className="min-w-0">
        <p className="truncate text-sm text-zinc-300 sm:hidden">{item.agent}</p>
        <p className="truncate text-sm text-zinc-400">{item.detail}</p>
      </div>
      <span className={cn('shrink-0 text-[11px] font-semibold', tone)}>{item.statusLabel}</span>
    </li>
  );
}

function OpsChart({
  points,
  max,
  reduce,
}: {
  points: AgentDashboardStats['weekOperations'];
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
        aria-label="Haftalık işlem hacmi"
      >
        <defs>
          <linearGradient id="bn-ops-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
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
        <polygon points={area} fill="url(#bn-ops-fill)" />
        <polyline
          points={line}
          fill="none"
          stroke="#34d399"
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
              stroke="#34d399"
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
