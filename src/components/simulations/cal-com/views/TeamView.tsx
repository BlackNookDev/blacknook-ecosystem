'use client';

import { TEAM_MEMBERS } from '@/components/simulations/cal-com/data';

export default function TeamView() {
  return (
    <div className="cal-scroll h-full overflow-auto p-5">
      <h2 className="font-display text-lg font-bold text-[var(--bn-heading)]">Ekip ve yönlendirme</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Round-robin, kolektif etkinlikler ve paylaşılan müsaitlik (Teams planı).
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {[
          { label: 'Ekip üyesi', value: String(TEAM_MEMBERS.length) },
          { label: 'Round-robin havuzu', value: '2 aktif' },
          { label: 'Bu ay toplantı', value: '25' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4"
          >
            <p className="text-xs text-zinc-500">{stat.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <ul className="mt-6 space-y-3">
        {TEAM_MEMBERS.map((member) => (
          <li
            key={member.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-zinc-200">
                {member.name
                  .split(' ')
                  .map((p) => p[0])
                  .join('')}
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-100">{member.name}</p>
                <p className="text-xs text-zinc-500">{member.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span>{member.events} etkinlik</span>
              <span>
                {member.roundRobin ? (
                  <span className="text-sky-300">Round-robin</span>
                ) : (
                  'Sabit atama'
                )}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <section className="mt-6 rounded-2xl border border-dashed border-white/15 p-5">
        <p className="text-sm font-semibold text-zinc-200">Anlık toplantı (Instant Meetings)</p>
        <p className="mt-1 text-sm text-zinc-500">
          Müşterilerle dakikalar içinde görüşme başlatın; paylaşılabilir anlık link oluşturun.
        </p>
      </section>
    </div>
  );
}
