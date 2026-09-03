'use client';

import { Plug, Webhook } from 'lucide-react';
import { FEATURE_HIGHLIGHTS, INTEGRATIONS } from '@/components/simulations/cal-com/data';

export default function IntegrationsView() {
  return (
    <div className="cal-scroll h-full overflow-auto p-5">
      <h2 className="font-display text-lg font-bold text-[var(--bn-heading)]">App Store</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Slack, Salesforce ve 100+ uygulama · takvim, CRM ve otomasyon entegrasyonları.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {INTEGRATIONS.map((app) => (
          <article
            key={app.id}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                <Plug className="h-4 w-4 text-zinc-400" aria-hidden />
              </div>
              <span
                className={
                  app.connected
                    ? 'rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300'
                    : 'rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-zinc-500'
                }
              >
                {app.connected ? 'Bağlı' : 'Bağlan'}
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold text-zinc-100">{app.name}</p>
            <p className="text-[11px] text-zinc-500">{app.category}</p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">{app.desc}</p>
          </article>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
        <div className="flex items-center gap-2">
          <Webhook className="h-4 w-4 text-zinc-500" aria-hidden />
          <h3 className="text-sm font-semibold text-zinc-200">Webhooks & OAuth API</h3>
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          Rezervasyon oluşturma, iptal ve yeniden planlama olaylarında webhook tetikleyin. Cal
          Atoms ile React uygulamanıza gömün.
        </p>
      </section>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURE_HIGHLIGHTS.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2.5"
          >
            <p className="text-xs font-semibold text-zinc-200">{item.title}</p>
            <p className="text-[11px] text-zinc-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
