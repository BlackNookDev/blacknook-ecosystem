'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Layers, MoreVertical, Timer } from 'lucide-react';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import {
  formatTokenCount,
  listAllDepartmentServices,
  mockMetricsForService,
} from '@/lib/otonom/departmentServices';
import { DEPARTMENT_LABELS } from '@/lib/otonom/catalog';

type ManagedAgent = {
  id: string;
  name: string;
  department: string;
  active: boolean;
  icon: string;
  brandColor: string;
  avgResponseMs: number;
  tokensToday: number;
  tokenBudgetDaily: number;
  status: 'running' | 'waiting' | 'idle';
  maxWorkers: number;
  queuedJobs: number;
};

const REPORTS = [
  { id: 'daily', label: 'Günlük özet' },
  { id: 'weekly', label: 'Haftalık verimlilik' },
  { id: 'tokens', label: 'Token raporu' },
] as const;

function useLiveMs(baseMs: number, active: boolean) {
  const [ms, setMs] = useState(baseMs);

  useEffect(() => {
    setMs(baseMs);
  }, [baseMs]);

  useEffect(() => {
    if (!active) return;

    const id = window.setInterval(() => {
      const delta = Math.floor(Math.random() * 90) - 45;
      setMs(Math.max(48, baseMs + delta));
    }, 2400);

    return () => window.clearInterval(id);
  }, [baseMs, active]);

  return ms;
}

function runtimeStats(agent: ManagedAgent) {
  if (!agent.active) {
    return { running: 0, queued: 0, idle: 0 };
  }

  const running =
    agent.status === 'running' ? Math.min(1, agent.maxWorkers) : 0;
  const queued = agent.status === 'waiting' ? agent.queuedJobs : 0;
  const idle = Math.max(0, agent.maxWorkers - running);

  return { running, queued, idle };
}

function AgentWorkerCard({
  agent,
  onToggle,
}: {
  agent: ManagedAgent;
  onToggle: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const liveMs = useLiveMs(agent.avgResponseMs, agent.active && agent.status === 'running');
  const { running, queued, idle } = runtimeStats(agent);

  useEffect(() => {
    if (!menuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [menuOpen]);

  return (
    <article className="group flex min-h-[8.5rem] flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:border-white/15 hover:bg-white/[0.04]">
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10"
          style={{ backgroundColor: `${agent.brandColor}18` }}
        >
          <ServiceCatalogLogo
            icon={agent.icon}
            brandColor={agent.brandColor}
            name={agent.name}
            size="sm"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-100">{agent.name}</p>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[11px] font-medium text-zinc-400">
            <Layers className="h-3 w-3 shrink-0" aria-hidden />
            {agent.department}
          </span>
        </div>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-200"
            aria-label={`${agent.name} seçenekleri`}
            aria-expanded={menuOpen}
          >
            <MoreVertical className="h-4 w-4" aria-hidden />
          </button>

          {menuOpen ? (
            <div className="absolute right-0 top-9 z-20 min-w-[9rem] rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  onToggle(agent.id);
                  setMenuOpen(false);
                }}
                className="block w-full px-3 py-2 text-left text-sm text-zinc-200 transition-colors hover:bg-white/[0.06]"
              >
                {agent.active ? 'Durdur' : 'Başlat'}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-[11px] text-zinc-500">
        <span className="inline-flex items-center gap-1.5 text-zinc-400">
          <Timer className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="font-medium text-zinc-300">{liveMs} ms</span>
        </span>
        <span>
          <span className="font-medium text-zinc-300">
            {running}/{agent.maxWorkers}
          </span>{' '}
          Çalışıyor
        </span>
        <span>
          <span className="font-medium text-zinc-300">{queued}</span> Kuyruk
        </span>
        <span>
          <span className="font-medium text-zinc-300">{formatTokenCount(agent.tokensToday)}</span>{' '}
          Token
        </span>
        {!agent.active ? (
          <span className="font-medium text-zinc-600">Kapalı</span>
        ) : idle > 0 ? (
          <span>
            <span className="font-medium text-zinc-300">{idle}</span> Boşta
          </span>
        ) : null}
      </div>
    </article>
  );
}

export default function AgentManageChatbot() {
  const initialAgents = useMemo(
    () =>
      listAllDepartmentServices().map((service) => {
        const metrics = mockMetricsForService(service.slug);
        return {
          id: service.slug,
          name: service.name,
          department: DEPARTMENT_LABELS[service.department],
          active: true,
          icon: service.icon,
          brandColor: service.brandColor,
          avgResponseMs: metrics.avgResponseMs,
          tokensToday: metrics.tokensToday,
          tokenBudgetDaily: metrics.tokenBudgetDaily,
          status: metrics.status,
          maxWorkers: metrics.maxWorkers,
          queuedJobs: metrics.queuedJobs,
        };
      }),
    []
  );

  const [agents, setAgents] = useState<ManagedAgent[]>(initialAgents);
  const [reportFlash, setReportFlash] = useState('');

  const toggleAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((agent) => (agent.id === id ? { ...agent, active: !agent.active } : agent))
    );
  };

  const downloadReport = (label: string) => {
    setReportFlash(`${label} indiriliyor…`);
    window.setTimeout(() => setReportFlash(''), 2400);
  };

  return (
    <div className="space-y-5">
      <h2 className="font-display text-[15px] font-bold text-[var(--bn-heading)]">Ajanlar</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {agents.map((agent) => (
          <AgentWorkerCard key={agent.id} agent={agent} onToggle={toggleAgent} />
        ))}
      </div>

      <section className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-[15px] font-bold text-[var(--bn-heading)]">Raporlar</h2>
          {reportFlash ? (
            <span className="text-xs text-emerald-200">{reportFlash}</span>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {REPORTS.map((report) => (
            <button
              key={report.id}
              type="button"
              onClick={() => downloadReport(report.label)}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              <Download className="h-4 w-4" aria-hidden />
              {report.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
