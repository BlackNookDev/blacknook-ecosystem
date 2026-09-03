'use client';

import { AVAILABILITY_SCHEDULE, BUFFER_SETTINGS, OOO_PERIODS } from '@/components/simulations/cal-com/data';

export default function AvailabilityView() {
  return (
    <div className="cal-scroll h-full overflow-auto p-5">
      <h2 className="font-display text-lg font-bold text-[var(--bn-heading)]">Müsaitlik ve limitler</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Haftalık çalışma saatleri, buffer, minimum bildirim ve toplantı limitleri.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <h3 className="text-sm font-semibold text-zinc-200">Haftalık program</h3>
          <ul className="mt-4 divide-y divide-white/[0.06]">
            {AVAILABILITY_SCHEDULE.map((row) => (
              <li key={row.day} className="flex items-center justify-between py-2.5 text-sm">
                <span className={row.active ? 'text-zinc-200' : 'text-zinc-600'}>{row.day}</span>
                <span className="text-zinc-500">
                  {row.active ? `${row.start} – ${row.end}` : 'Kapalı'}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <h3 className="text-sm font-semibold text-zinc-200">Buffer ve limitler</h3>
          <dl className="mt-4 space-y-3 text-sm">
            {Object.entries({
              'Minimum bildirim': BUFFER_SETTINGS.minimumNotice,
              'Öncesi buffer': BUFFER_SETTINGS.bufferBefore,
              'Sonrası buffer': BUFFER_SETTINGS.bufferAfter,
              'Slot aralığı': BUFFER_SETTINGS.slotInterval,
              'Günlük limit': BUFFER_SETTINGS.dailyLimit,
              'Haftalık limit': BUFFER_SETTINGS.weeklyLimit,
            }).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4">
                <dt className="text-zinc-500">{key}</dt>
                <dd className="font-medium text-zinc-200">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
        <h3 className="text-sm font-semibold text-zinc-200">Out of Office (OOO)</h3>
        <p className="mt-1 text-sm text-zinc-500">İzin ve kapalı dönemlerde rezervasyon alınmaz.</p>
        <ul className="mt-4 space-y-2">
          {OOO_PERIODS.map((period) => (
            <li
              key={period.id}
              className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium text-zinc-200">{period.label}</p>
                <p className="text-xs text-zinc-500">{period.range}</p>
              </div>
              <span
                className={
                  period.active
                    ? 'text-xs font-semibold text-amber-300'
                    : 'text-xs text-zinc-600'
                }
              >
                {period.active ? 'Aktif' : 'Pasif'}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
