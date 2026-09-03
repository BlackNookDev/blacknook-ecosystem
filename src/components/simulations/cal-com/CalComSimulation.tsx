'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  EVENT_TYPES,
  SIM_NAV,
  type CalEventType,
  type DurationOption,
  type SimView,
} from '@/components/simulations/cal-com/data';
import BookingPageView from '@/components/simulations/cal-com/views/BookingPageView';
import EventTypesView from '@/components/simulations/cal-com/views/EventTypesView';
import AvailabilityView from '@/components/simulations/cal-com/views/AvailabilityView';
import WorkflowsView from '@/components/simulations/cal-com/views/WorkflowsView';
import IntegrationsView from '@/components/simulations/cal-com/views/IntegrationsView';
import TeamView from '@/components/simulations/cal-com/views/TeamView';
import PaymentsView from '@/components/simulations/cal-com/views/PaymentsView';
import EmbedView from '@/components/simulations/cal-com/views/EmbedView';
import './simulation.css';

type SelectedSlot = {
  dayKey: string;
  dayLabel: string;
  date: string;
  time: string;
};

export default function CalComSimulation() {
  const [view, setView] = useState<SimView>('booking');
  const [eventType, setEventType] = useState<CalEventType>(EVENT_TYPES[0]);
  const [duration, setDuration] = useState<DurationOption>(EVENT_TYPES[0].durations[0]);
  const [selected, setSelected] = useState<SelectedSlot | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [overlayCalendar, setOverlayCalendar] = useState(false);
  const [timeFormat24, setTimeFormat24] = useState(true);

  const selectEvent = (event: CalEventType) => {
    setEventType(event);
    setDuration(event.durations[0]);
    setSelected(null);
    setConfirmed(false);
    setView('booking');
  };

  return (
    <div className="cal-sim flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-[var(--bn-card-border)] bg-[var(--bn-card-bg-solid)] shadow-[var(--bn-card-shadow)]">
      <nav className="cal-scroll flex shrink-0 gap-1 overflow-x-auto border-b border-[var(--bn-border)] bg-[var(--bn-surface)] px-3 py-2">
        {SIM_NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setView(item.id)}
            className={cn(
              'shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
              view === item.id
                ? 'bg-white text-zinc-950'
                : 'text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200'
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="min-h-0 flex-1">
        {view === 'booking' ? (
          <BookingPageView
            eventType={eventType}
            duration={duration}
            onDurationChange={setDuration}
            selected={selected}
            onSelectSlot={setSelected}
            confirmed={confirmed}
            onConfirm={() => setConfirmed(true)}
            overlayCalendar={overlayCalendar}
            onOverlayChange={setOverlayCalendar}
            timeFormat24={timeFormat24}
            onTimeFormatChange={setTimeFormat24}
          />
        ) : null}
        {view === 'events' ? (
          <EventTypesView activeId={eventType.id} onSelect={selectEvent} />
        ) : null}
        {view === 'availability' ? <AvailabilityView /> : null}
        {view === 'workflows' ? <WorkflowsView /> : null}
        {view === 'integrations' ? <IntegrationsView /> : null}
        {view === 'team' ? <TeamView /> : null}
        {view === 'payments' ? <PaymentsView /> : null}
        {view === 'embed' ? <EmbedView /> : null}
      </div>
    </div>
  );
}
