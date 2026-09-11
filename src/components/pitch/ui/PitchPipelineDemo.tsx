'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import {
  Check,
  HardHat,
  Loader2,
  MessageSquare,
  Search,
  Server,
  Sparkles,
  Wrench,
} from 'lucide-react';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import { duration, easePremium } from '@/components/motion/tokens';
import { cn } from '@/lib/utils';
import { getHeroAgents } from '../../../../lib/data';

const QUERY = 'destek ajanı';

const STEPS = [
  { id: 'search', label: 'Ara', caption: 'Doğal dil ile ajanı bul' },
  { id: 'request', label: 'Talep', caption: 'Kurulum talep et' },
  { id: 'engineers', label: 'Kur', caption: 'Blacknook mühendisleri' },
  { id: 'running', label: 'Canlı', caption: 'Proje çalışıyor' },
  { id: 'panel', label: 'İşlet', caption: 'Ajan yönetim paneli' },
] as const;

type StepId = (typeof STEPS)[number]['id'];

const STEP_MS: Record<StepId, number> = {
  search: 4200,
  request: 3200,
  engineers: 4800,
  running: 3200,
  panel: 5200,
};

const ENGINEER_TASKS = [
  { label: 'Ortam hazırlama', icon: Server },
  { label: 'Entegrasyon bağlama', icon: Wrench },
  { label: 'Güvenlik & go-live', icon: HardHat },
] as const;

const DEPARTMENTS = [
  { name: 'Muhasebe', tone: '#14B8A6' },
  { name: 'Destek', tone: '#1F93FF' },
  { name: 'Satış', tone: '#F59E0B' },
  { name: 'Operasyon', tone: '#A1A1AA' },
  { name: 'Pazarlama', tone: '#94A3B8' },
  { name: 'İK', tone: '#F472B6' },
] as const;

function Chrome({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#0e0e10] shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="ml-3 text-[11px] font-semibold tracking-wide text-zinc-500">
          {title}
        </span>
      </div>
      <div className="relative min-h-[320px] sm:min-h-[360px]">{children}</div>
    </div>
  );
}

function StepRail({ active }: { active: number }) {
  return (
    <ol className="flex w-full flex-wrap items-center justify-center gap-2 sm:gap-1">
      {STEPS.map((step, i) => {
        const done = i < active;
        const current = i === active;
        return (
          <li key={step.id} className="flex items-center gap-1 sm:gap-2">
            <div
              className={cn(
                'flex items-center gap-2 rounded-full border px-2.5 py-1.5 transition-colors duration-300',
                current
                  ? 'border-sky-400/40 bg-sky-400/10 text-sky-100'
                  : done
                    ? 'border-white/15 bg-white/[0.06] text-zinc-200'
                    : 'border-white/[0.06] bg-transparent text-zinc-600'
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                  current
                    ? 'bg-sky-400 text-zinc-950'
                    : done
                      ? 'bg-white/20 text-white'
                      : 'bg-white/[0.06] text-zinc-500'
                )}
              >
                {done ? <Check className="h-3 w-3" aria-hidden /> : i + 1}
              </span>
              <span className="hidden text-[11px] font-semibold sm:inline">{step.label}</span>
            </div>
            {i < STEPS.length - 1 ? (
              <span
                className={cn(
                  'mx-0.5 hidden h-px w-4 sm:block md:w-8',
                  done || current ? 'bg-sky-400/40' : 'bg-white/10'
                )}
                aria-hidden
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function SearchStage({ queryLen }: { queryLen: number }) {
  const agents = useMemo(() => getHeroAgents().slice(0, 4), []);
  const typed = QUERY.slice(0, queryLen);
  const highlightSlug = 'chatwoot';

  return (
    <Chrome title="Blacknook · Katalog">
      <div className="p-4 sm:p-6">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            aria-hidden
          />
          <div className="flex h-12 items-center rounded-xl border border-white/15 bg-white/[0.04] pl-10 pr-4 text-sm text-zinc-100">
            <span>{typed}</span>
            <m.span
              className="ml-0.5 inline-block h-4 w-px bg-sky-300"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
              aria-hidden
            />
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {agents.map((a) => {
            const match =
              queryLen >= 4 &&
              (a.slug === highlightSlug || a.name.toLowerCase().includes('destek'));
            return (
              <m.div
                key={a.slug}
                layout
                animate={{
                  opacity: queryLen < 3 ? 0.45 : match ? 1 : 0.28,
                  scale: match ? 1.02 : 1,
                  borderColor: match ? 'rgba(56,189,248,0.45)' : 'rgba(255,255,255,0.07)',
                }}
                transition={{ duration: duration.fast, ease: easePremium }}
                className={cn(
                  'flex items-center gap-3 rounded-xl border bg-white/[0.03] p-3',
                  match && 'bg-sky-400/[0.06] shadow-[0_0_0_1px_rgba(56,189,248,0.12)]'
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <ServiceCatalogLogo
                    icon={a.icon}
                    brandColor={a.brandColor}
                    name={a.name}
                    size="sm"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-zinc-100">
                    {a.name.replace(' Ajanı', '')}
                  </p>
                  <p className="text-[10px] text-zinc-500">Katalog · Kurulum talebi</p>
                </div>
                {match ? (
                  <m.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-full bg-sky-400/20 px-2 py-0.5 text-[10px] font-bold text-sky-200"
                  >
                    Eşleşti
                  </m.span>
                ) : null}
              </m.div>
            );
          })}
        </div>
      </div>
    </Chrome>
  );
}

function RequestStage({ phase }: { phase: number }) {
  const agent = useMemo(
    () => getHeroAgents().find((a) => a.slug === 'chatwoot') ?? getHeroAgents()[0],
    []
  );

  return (
    <Chrome title="Kurulum talebi">
      <div className="flex flex-col items-center justify-center gap-5 p-6 sm:p-8">
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex w-full max-w-md items-center gap-4 rounded-2xl border border-white/12 bg-white/[0.04] p-4"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <ServiceCatalogLogo
              icon={agent.icon}
              brandColor={agent.brandColor}
              name={agent.name}
              size="md"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-semibold text-zinc-50">{agent.name}</p>
            <p className="text-xs text-zinc-500">Yönetilen kurulum · KVKK / bulut / on-prem</p>
          </div>
        </m.div>

        <m.button
          type="button"
          animate={
            phase >= 1
              ? { scale: [1, 0.97, 1], backgroundColor: 'rgba(255,255,255,1)' }
              : { scale: 1 }
          }
          transition={{ duration: 0.45, ease: easePremium }}
          className="inline-flex h-12 w-full max-w-md items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-zinc-950"
        >
          {phase >= 2 ? (
            <>
              <Check className="h-4 w-4 text-zinc-900" aria-hidden />
              Talep alındı
            </>
          ) : (
            'Kurulum Talep Et'
          )}
        </m.button>

        <AnimatePresence>
          {phase >= 2 ? (
            <m.ul
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md space-y-2"
            >
              {['Form kaydı', 'Operasyon kuyruğu', 'Mühendis ataması'].map((item, i) => (
                <m.li
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12, duration: duration.fast, ease: easePremium }}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs text-zinc-300"
                >
                  <Check className="h-3.5 w-3.5 text-sky-400" aria-hidden />
                  {item}
                </m.li>
              ))}
            </m.ul>
          ) : null}
        </AnimatePresence>
      </div>
    </Chrome>
  );
}

function EngineersStage({ progress }: { progress: number }) {
  return (
    <Chrome title="Blacknook Mühendislik">
      <div className="p-5 sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex -space-x-2">
            {['M', 'A', 'K'].map((initial, i) => (
              <m.span
                key={initial}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: duration.fast }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0e0e10] bg-gradient-to-br from-zinc-200 to-zinc-500 text-[11px] font-bold text-zinc-900"
              >
                {initial}
              </m.span>
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-100">Kurulum ekibi devrede</p>
            <p className="text-[11px] text-zinc-500">Anahtar teslim onboarding</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-100">
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
            Aktif
          </span>
        </div>

        <ul className="space-y-3">
          {ENGINEER_TASKS.map((task, i) => {
            const Icon = task.icon;
            const threshold = (i + 1) / ENGINEER_TASKS.length;
            const done = progress >= threshold;
            const active = progress >= i / ENGINEER_TASKS.length && !done;
            const bar = Math.min(
              1,
              Math.max(0, (progress - i / ENGINEER_TASKS.length) * ENGINEER_TASKS.length)
            );

            return (
              <li
                key={task.label}
                className={cn(
                  'rounded-xl border p-3 transition-colors',
                  done
                    ? 'border-sky-400/30 bg-sky-400/[0.07]'
                    : active
                      ? 'border-white/15 bg-white/[0.05]'
                      : 'border-white/[0.06] bg-white/[0.02]'
                )}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      done ? 'text-sky-300' : active ? 'text-zinc-200' : 'text-zinc-600'
                    )}
                    aria-hidden
                  />
                  <span className="flex-1 text-xs font-semibold text-zinc-200">{task.label}</span>
                  {done ? (
                    <Check className="h-3.5 w-3.5 text-sky-400" aria-hidden />
                  ) : active ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-400" aria-hidden />
                  ) : null}
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <m.div
                    className="h-full rounded-full bg-sky-400/70"
                    animate={{ width: `${bar * 100}%` }}
                    transition={{ duration: duration.fast, ease: easePremium }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Chrome>
  );
}

function RunningStage() {
  return (
    <Chrome title="Canlı ortam">
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-6 p-6 sm:min-h-[360px]">
        <m.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: duration.scene, ease: easePremium }}
          className="relative flex h-24 w-24 items-center justify-center"
        >
          <m.span
            className="absolute inset-0 rounded-full border border-sky-400/30"
            animate={{ scale: [1, 1.35], opacity: [0.55, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            aria-hidden
          />
          <m.span
            className="absolute inset-2 rounded-full border border-sky-300/40"
            animate={{ scale: [1, 1.25], opacity: [0.7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.25 }}
            aria-hidden
          />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-sky-400 text-zinc-950 shadow-[0_0_40px_rgba(56,189,248,0.35)]">
            <Check className="h-8 w-8" strokeWidth={2.5} aria-hidden />
          </span>
        </m.div>

        <div className="text-center">
          <p className="font-display text-xl font-semibold text-zinc-50">Proje çalışıyor</p>
          <p className="mt-1 text-sm text-zinc-400">Chatwoot Destek Ajanı · production</p>
        </div>

        <div className="grid w-full max-w-md grid-cols-3 gap-2">
          {[
            { k: 'Uptime', v: '99.9%' },
            { k: 'Ticket', v: '12 / saat' },
            { k: 'SLA', v: '< 2 dk' },
          ].map((stat, i) => (
            <m.div
              key={stat.k}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: duration.fast }}
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-2 py-3 text-center"
            >
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">{stat.k}</p>
              <p className="mt-1 text-sm font-semibold text-sky-200">{stat.v}</p>
            </m.div>
          ))}
        </div>
      </div>
    </Chrome>
  );
}

function PanelStage() {
  const agents = useMemo(() => getHeroAgents().slice(0, 6), []);

  return (
    <Chrome title="Blacknook Otonom · /agent">
      <div className="grid grid-cols-[6.5rem_1fr] sm:grid-cols-[9rem_1fr]">
        <aside className="border-r border-white/[0.06] bg-white/[0.02] p-3">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
            Departman
          </p>
          <ul className="space-y-1.5">
            {DEPARTMENTS.map((d, i) => (
              <m.li
                key={d.name}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: duration.fast }}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px]',
                  i === 1 ? 'bg-white/[0.08] text-zinc-50' : 'text-zinc-500'
                )}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: d.tone }}
                  aria-hidden
                />
                {d.name}
              </m.li>
            ))}
          </ul>
        </aside>
        <div className="p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold text-zinc-200">Departman ajanları</p>
            <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500">
              <Sparkles className="h-3 w-3" aria-hidden />
              Studio
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {agents.map((a, i) => (
              <m.div
                key={a.slug}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.06, duration: duration.fast }}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border p-3',
                  a.slug === 'chatwoot'
                    ? 'border-sky-400/35 bg-sky-400/[0.08]'
                    : 'border-white/[0.07] bg-white/[0.03]'
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <ServiceCatalogLogo
                    icon={a.icon}
                    brandColor={a.brandColor}
                    name={a.name}
                    size="sm"
                  />
                </div>
                <span className="line-clamp-1 text-center text-[10px] font-medium text-zinc-400">
                  {a.name.replace(' Ajanı', '')}
                </span>
              </m.div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
            <MessageSquare className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden />
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
              <m.div
                className="h-full rounded-full bg-sky-400/50"
                animate={{ width: ['18%', '72%', '48%'] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: easePremium }}
              />
            </div>
            <span className="text-[10px] text-sky-300/90">Canlı</span>
          </div>
        </div>
      </div>
    </Chrome>
  );
}

export function PitchPipelineDemo() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [queryLen, setQueryLen] = useState(0);
  const [requestPhase, setRequestPhase] = useState(0);
  const [engineerProgress, setEngineerProgress] = useState(0);

  const stepId = STEPS[step]?.id ?? 'search';

  useEffect(() => {
    if (reduce) {
      setStep(STEPS.length - 1);
      setQueryLen(QUERY.length);
      setRequestPhase(2);
      setEngineerProgress(1);
      return;
    }

    const timer = window.setTimeout(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, STEP_MS[stepId]);

    return () => window.clearTimeout(timer);
  }, [step, stepId, reduce]);

  useEffect(() => {
    if (reduce || stepId !== 'search') return;
    setQueryLen(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setQueryLen(Math.min(QUERY.length, i));
      if (i >= QUERY.length) window.clearInterval(id);
    }, 110);
    return () => window.clearInterval(id);
  }, [stepId, reduce]);

  useEffect(() => {
    if (reduce || stepId !== 'request') return;
    setRequestPhase(0);
    const t1 = window.setTimeout(() => setRequestPhase(1), 900);
    const t2 = window.setTimeout(() => setRequestPhase(2), 1600);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [stepId, reduce]);

  useEffect(() => {
    if (reduce || stepId !== 'engineers') return;
    setEngineerProgress(0);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 4200);
      setEngineerProgress(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stepId, reduce]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-lg font-semibold text-zinc-50 md:text-xl">
            Keşfet → Kur → İşlet
          </p>
          <p className="mt-1 text-sm text-zinc-400">{STEPS[step]?.caption}</p>
        </div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-600">
          Canlı yol haritası
        </p>
      </div>

      <StepRail active={step} />

      <div className="relative">
        <AnimatePresence mode="wait">
          <m.div
            key={stepId}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: duration.base, ease: easePremium }}
          >
            {stepId === 'search' ? <SearchStage queryLen={queryLen} /> : null}
            {stepId === 'request' ? <RequestStage phase={requestPhase} /> : null}
            {stepId === 'engineers' ? (
              <EngineersStage progress={engineerProgress} />
            ) : null}
            {stepId === 'running' ? <RunningStage /> : null}
            {stepId === 'panel' ? <PanelStage /> : null}
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
