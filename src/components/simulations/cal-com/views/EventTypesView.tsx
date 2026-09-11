'use client';

import { Check, Link2, RefreshCw, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EVENT_TYPES, HOST } from '@/components/simulations/cal-com/data';
import type { CalEventType } from '@/components/simulations/cal-com/data';

type Props = {
  activeId: string;
  onSelect: (event: CalEventType) => void;
};

export default function EventTypesView({ activeId, onSelect }: Props) {
  return (
    <div className="cal-scroll h-full overflow-auto p-5">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-[var(--bn-heading)]">Etkinlik türleri</h2>
        </div>
        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-500 opacity-60"
        >
          + Yeni etkinlik
        </button>
      </div>

      <ul className="space-y-3">
        {EVENT_TYPES.map((event) => {
          const active = event.id === activeId;
          return (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => onSelect(event)}
                className={cn(
                  'w-full rounded-2xl border p-4 text-left transition-colors',
                  active
                    ? 'border-white/25 bg-white/[0.06]'
                    : 'border-white/[0.08] bg-white/[0.02] hover:border-white/15'
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-100">{event.title}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                      <Link2 className="h-3 w-3" aria-hidden />
                      cal/{HOST.username}/{event.slug}
                    </p>
                  </div>
                  {active ? <Check className="h-4 w-4 text-emerald-300" aria-hidden /> : null}
                </div>
                <p className="mt-2 text-sm text-zinc-400">{event.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {event.durations.map((d) => (
                    <span
                      key={d}
                      className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-zinc-400"
                    >
                      {d}
                    </span>
                  ))}
                  {event.recurring ? (
                    <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-200">
                      Tekrarlayan
                    </span>
                  ) : null}
                  {event.roundRobin ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/30 bg-sky-500/10 px-2 py-0.5 text-[10px] text-sky-200">
                      <Users className="h-3 w-3" aria-hidden />
                      Round-robin
                    </span>
                  ) : null}
                  {event.requiresConfirmation ? (
                    <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-200">
                      Onay gerekli
                    </span>
                  ) : null}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
        <p className="text-sm font-semibold text-zinc-200">Dinamik grup linkleri</p>
        <p className="mt-1 text-sm text-zinc-500">
          Birden fazla kişinin müsaitliğine göre otomatik slot önerisi (Collective Events).
        </p>
        <button
          type="button"
          disabled
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          Önizleme modu
        </button>
      </div>
    </div>
  );
}
