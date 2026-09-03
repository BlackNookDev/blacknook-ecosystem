'use client';

import { Bell, Mail, MessageSquare } from 'lucide-react';
import { NOTIFICATION_FEED, WORKFLOW_TEMPLATES } from '@/components/simulations/cal-com/data';

export default function WorkflowsView() {
  return (
    <div className="cal-scroll grid h-full min-h-0 gap-4 overflow-auto p-5 lg:grid-cols-2">
      <section>
        <h2 className="font-display text-lg font-bold text-[var(--bn-heading)]">Workflows</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Otomatik hatırlatıcılar, onaylar ve takip e-postaları.
        </p>
        <ul className="mt-5 space-y-3">
          {WORKFLOW_TEMPLATES.map((flow) => (
            <li
              key={flow.id}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-100">{flow.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">{flow.trigger}</p>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  Aktif
                </span>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
                <Mail className="h-3.5 w-3.5" aria-hidden />
                {flow.channel}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-lg font-bold text-[var(--bn-heading)]">Bildirim akışı</h2>
        <p className="mt-1 text-sm text-zinc-500">No-show azaltma ve rezervasyon güncellemeleri.</p>
        <ul className="mt-5 space-y-3">
          {NOTIFICATION_FEED.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4"
            >
              <div className="flex gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                  {item.type === 'reminder' ? (
                    <Bell className="h-4 w-4 text-amber-300" aria-hidden />
                  ) : item.type === 'reschedule' ? (
                    <MessageSquare className="h-4 w-4 text-sky-300" aria-hidden />
                  ) : (
                    <Mail className="h-4 w-4 text-emerald-300" aria-hidden />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-zinc-100">{item.title}</p>
                  <p className="mt-1 text-sm text-zinc-500">{item.body}</p>
                  <p className="mt-2 text-xs text-zinc-600">{item.time}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
