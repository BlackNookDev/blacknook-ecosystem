'use client';

import {
  Calendar,
  Clock,
  CreditCard,
  Globe,
  Layers,
  MapPin,
  Video,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BOOKED_SLOTS,
  DURATION_LABELS,
  EVENT_TYPES,
  HOST,
  LOCATION_LABELS,
  TIME_SLOTS,
  WEEK_DAYS,
  type CalEventType,
  type DurationOption,
} from '@/components/simulations/cal-com/data';

type SelectedSlot = {
  dayKey: string;
  dayLabel: string;
  date: string;
  time: string;
};

type Props = {
  eventType: CalEventType;
  duration: DurationOption;
  onDurationChange: (value: DurationOption) => void;
  selected: SelectedSlot | null;
  onSelectSlot: (slot: SelectedSlot | null) => void;
  confirmed: boolean;
  onConfirm: () => void;
  overlayCalendar: boolean;
  onOverlayChange: (value: boolean) => void;
  timeFormat24: boolean;
  onTimeFormatChange: (value: boolean) => void;
};

export default function BookingPageView({
  eventType,
  duration,
  onDurationChange,
  selected,
  onSelectSlot,
  confirmed,
  onConfirm,
  overlayCalendar,
  onOverlayChange,
  timeFormat24,
  onTimeFormatChange,
}: Props) {
  const monthLabel = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(
    new Date()
  );

  const selectSlot = (dayKey: string, dayLabel: string, date: string, time: string) => {
    if (BOOKED_SLOTS.has(`${dayKey}-${time}`)) return;
    onSelectSlot({ dayKey, dayLabel, date, time });
  };

  return (
    <div className="cal-scroll flex h-full min-h-0 flex-col overflow-auto lg:flex-row">
      <section className="w-full shrink-0 border-b border-[var(--bn-border)] bg-[var(--bn-surface)] p-5 lg:w-[19rem] lg:border-b-0 lg:border-r xl:w-[21rem]">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-zinc-900">
            BN
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{HOST.name}</p>
            <p className="truncate text-xs text-zinc-500">cal/{HOST.username}</p>
          </div>
        </div>

        <h2 className="mt-5 font-display text-xl font-bold text-[var(--bn-heading)]">
          {eventType.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--bn-subtitle)]">
          {eventType.description}
        </p>

        <div className="mt-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Süre</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {eventType.durations.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onDurationChange(item)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                  duration === item
                    ? 'border-white bg-white text-zinc-950'
                    : 'border-white/10 text-zinc-300 hover:border-white/20'
                )}
              >
                {DURATION_LABELS[item]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-3 text-sm text-zinc-300">
          <MetaRow icon={Video} label={LOCATION_LABELS[eventType.location]} />
          <MetaRow icon={Globe} label={HOST.timezoneLabel} />
          <MetaRow icon={Clock} label={`Minimum bildirim: 4 saat`} />
          {eventType.price ? (
            <MetaRow icon={CreditCard} label={`Ücret: ${eventType.price} (Stripe)`} />
          ) : null}
          {eventType.requiresConfirmation ? (
            <MetaRow icon={Layers} label="Onay gerekli" />
          ) : null}
          {eventType.roundRobin ? <MetaRow icon={MapPin} label="Round-robin atama" /> : null}
        </div>

        <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Özellikler
          </p>
          <ul className="mt-2 space-y-1.5 text-xs text-zinc-400">
            <li>· Takvim senkronu (çift rezervasyon yok)</li>
            <li>· E-posta / SMS hatırlatıcı</li>
            <li>· Yeniden planlama linki</li>
            <li>· Misafir takvime ekleme</li>
          </ul>
        </div>
      </section>

      <section className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--bn-border)] px-5 py-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
            <Calendar className="h-4 w-4 text-zinc-500" aria-hidden />
            {monthLabel}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={overlayCalendar}
                onChange={(e) => onOverlayChange(e.target.checked)}
                className="rounded"
              />
              Takvimimi göster
            </label>
            <div className="flex rounded-lg border border-white/10 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => onTimeFormatChange(false)}
                className={cn(
                  'rounded-md px-2 py-1',
                  !timeFormat24 ? 'bg-white text-zinc-950' : 'text-zinc-400'
                )}
              >
                12s
              </button>
              <button
                type="button"
                onClick={() => onTimeFormatChange(true)}
                className={cn(
                  'rounded-md px-2 py-1',
                  timeFormat24 ? 'bg-white text-zinc-950' : 'text-zinc-400'
                )}
              >
                24s
              </button>
            </div>
          </div>
        </div>

        <div className="cal-scroll flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-5 lg:flex-row">
          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-5 gap-2">
              {WEEK_DAYS.map((day) => (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => onSelectSlot(null)}
                  className={cn(
                    'rounded-xl border py-3 text-center transition-colors',
                    selected?.dayKey === day.key
                      ? 'border-white/30 bg-white/[0.08]'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/15'
                  )}
                >
                  <p className="text-[10px] font-semibold uppercase text-zinc-500">{day.label}</p>
                  <p className="mt-1 text-lg font-bold text-zinc-100">{day.date}</p>
                </button>
              ))}
            </div>

            {overlayCalendar ? (
              <div className="mt-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-4">
                <p className="text-xs font-medium text-zinc-400">Takvim bindirmesi (simülasyon)</p>
                <div className="mt-3 space-y-2">
                  {['Öğle yemeği', 'Ekip toplantısı', 'Müşteri görüşmesi'].map((item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-100"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="w-full shrink-0 lg:w-44">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Müsait saatler
            </p>
            <ul className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {TIME_SLOTS.map((time) => {
                const dayKey = selected?.dayKey ?? 'wed';
                const slotKey = `${dayKey}-${time}`;
                const booked = BOOKED_SLOTS.has(slotKey);
                const isSelected = selected?.time === time;
                const displayTime = timeFormat24
                  ? time
                  : `${Number(time.split(':')[0]) > 12 ? Number(time.split(':')[0]) - 12 : Number(time.split(':')[0])}:${time.split(':')[1]} ${Number(time.split(':')[0]) >= 12 ? 'ÖS' : 'ÖÖ'}`;

                return (
                  <li key={time}>
                    <button
                      type="button"
                      disabled={booked}
                      onClick={() => {
                        const day = WEEK_DAYS.find((d) => d.key === dayKey) ?? WEEK_DAYS[2];
                        selectSlot(day.key, day.label, day.date, time);
                      }}
                      className={cn(
                        'w-full rounded-lg border px-2 py-2 text-center text-xs font-semibold transition-colors',
                        booked
                          ? 'cursor-not-allowed text-zinc-600 line-through opacity-40'
                          : isSelected
                            ? 'slot-pulse border-white bg-white text-zinc-950'
                            : 'border-white/10 bg-white/[0.03] text-zinc-200 hover:border-white/20'
                      )}
                    >
                      {displayTime}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {selected ? (
          <div className="border-t border-[var(--bn-border)] bg-[var(--bn-surface)] p-5">
            <p className="text-sm font-semibold text-white">Rezervasyon detayı</p>
            <p className="mt-1 text-sm text-zinc-400">
              {selected.dayLabel} {selected.date} · {selected.time} · {DURATION_LABELS[duration]}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <PreviewField label="Ad soyad" />
              <PreviewField label="E-posta" />
              <PreviewField label="Notlar (opsiyonel)" />
            </div>
            <button
              type="button"
              onClick={onConfirm}
              disabled={confirmed}
              className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-zinc-950 disabled:opacity-70"
            >
              {confirmed ? 'Rezervasyon onaylandı · e-posta gönderildi' : 'Rezervasyonu tamamla'}
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
}: {
  icon: typeof Video;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
      <span>{label}</span>
    </div>
  );
}

function PreviewField({ label }: { label: string }) {
  return (
    <div>
      <p className="text-[11px] text-zinc-500">{label}</p>
      <p className="mt-1 rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-sm text-zinc-500">
        —
      </p>
    </div>
  );
}
