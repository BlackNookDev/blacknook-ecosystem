'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import {
  Check,
  HardHat,
  Lock,
  MessageSquare,
  Radar,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import { PitchScrollReveal } from '@/components/pitch/ui/PitchScrollReveal';
import { OPS_MODEL } from '@/lib/pitchData';
import { duration, easePremium } from '@/components/motion/tokens';
import { cn } from '@/lib/utils';
import { getHeroAgents } from '../../../../lib/data';

type OpsStep = (typeof OPS_MODEL.steps)[number];

const SEARCH_QUERY = 'şantiye için fatura sistemi';

const INTENT_CHIPS = [
  { label: 'sektör: inşaat', delay: 0.15 },
  { label: 'ihtiyaç: fatura', delay: 0.35 },
  { label: 'bağlam: saha', delay: 0.55 },
] as const;

const DEPARTMENTS = [
  { name: 'Muhasebe', tone: '#14B8A6' },
  { name: 'Destek', tone: '#1F93FF' },
  { name: 'Satış', tone: '#F59E0B' },
  { name: 'Operasyon', tone: '#A1A1AA' },
  { name: 'Pazarlama', tone: '#94A3B8' },
  { name: 'İK', tone: '#F472B6' },
] as const;

function useInViewActive(reduce: boolean | null) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (reduce) {
      setActive(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setActive(true);
      },
      { threshold: 0.35, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return { ref, active };
}

function DiscoverVisual({ active }: { active: boolean }) {
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<'type' | 'parse' | 'rank' | 'pick'>('type');

  const items = [
    { name: 'NOOK Muhasebe', match: true, hint: 'Şantiye fatura & gider', score: 98 },
    { name: 'Chatwoot Destek', match: false, hint: 'Müşteri destek', score: 41 },
    { name: 'Cal.com Randevu', match: false, hint: 'Saha planlama', score: 36 },
    { name: 'Metabase BI', match: false, hint: 'Maliyet raporu', score: 52 },
  ];

  useEffect(() => {
    if (!active) {
      setTyped(0);
      setPhase('type');
      return;
    }
    setTyped(0);
    setPhase('type');
    let i = 0;
    const typeId = window.setInterval(() => {
      i += 1;
      setTyped(Math.min(SEARCH_QUERY.length, i));
      if (i >= SEARCH_QUERY.length) window.clearInterval(typeId);
    }, 55);
    const parseId = window.setTimeout(() => setPhase('parse'), 1600);
    const rankId = window.setTimeout(() => setPhase('rank'), 2400);
    const pickId = window.setTimeout(() => setPhase('pick'), 3600);
    return () => {
      window.clearInterval(typeId);
      window.clearTimeout(parseId);
      window.clearTimeout(rankId);
      window.clearTimeout(pickId);
    };
  }, [active]);

  const shown = SEARCH_QUERY.slice(0, typed);
  const filtering = phase === 'rank' || phase === 'pick';
  const picked = phase === 'pick';

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e]">
      <div className="border-b border-white/[0.06] px-3 py-2.5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
            Doğal dil arama
          </span>
          <AnimatePresence mode="wait">
            <m.span
              key={phase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-[10px] font-medium text-sky-300/90"
            >
              {phase === 'type' && 'Sorgu yazılıyor…'}
              {phase === 'parse' && 'Niyet çözümleniyor…'}
              {phase === 'rank' && 'Ajanlar eşleştiriliyor…'}
              {phase === 'pick' && 'En uygun çözüm seçildi'}
            </m.span>
          </AnimatePresence>
        </div>
        <div className="relative flex h-11 items-center gap-2.5 rounded-xl border border-white/12 bg-white/[0.04] px-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
          <div className="min-w-0 flex-1 truncate font-mono text-[12px] text-zinc-100 sm:text-sm">
            {shown}
            {active && typed < SEARCH_QUERY.length ? (
              <m.span
                className="ml-0.5 inline-block h-4 w-px align-middle bg-sky-300"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.55, repeat: Infinity }}
                aria-hidden
              />
            ) : null}
          </div>
          {filtering ? (
            <m.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-zinc-300"
            >
              1 güçlü eşleşme
            </m.span>
          ) : null}
        </div>

        <AnimatePresence>
          {phase !== 'type' ? (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2.5 flex flex-wrap gap-1.5 overflow-hidden"
            >
              {INTENT_CHIPS.map((chip) => (
                <m.span
                  key={chip.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: chip.delay, duration: duration.fast }}
                  className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-zinc-400"
                >
                  {chip.label}
                </m.span>
              ))}
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="grid gap-2 p-3 sm:grid-cols-2">
        {items.map((item, i) => {
          const dim = filtering && !item.match;
          const selected = picked && item.match;
          return (
            <m.div
              key={item.name}
              layout
              animate={{
                opacity: dim ? 0.28 : 1,
                scale: selected ? 1.03 : 1,
                y: filtering && !item.match ? 4 : 0,
                borderColor: selected
                  ? 'rgba(56,189,248,0.55)'
                  : 'rgba(255,255,255,0.08)',
                backgroundColor: selected
                  ? 'rgba(56,189,248,0.1)'
                  : 'rgba(255,255,255,0.03)',
              }}
              transition={{ duration: duration.fast, ease: easePremium, delay: i * 0.05 }}
              className="relative rounded-xl border p-3"
            >
              <div className="flex items-center gap-2.5">
                <m.span
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[11px] font-bold text-zinc-300"
                  animate={
                    selected
                      ? { boxShadow: ['0 0 0 0 rgba(56,189,248,0)', '0 0 0 8px rgba(56,189,248,0)'] }
                      : {}
                  }
                  transition={{ duration: 1.2, repeat: selected ? Infinity : 0 }}
                >
                  {item.name.slice(0, 1)}
                </m.span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-semibold text-zinc-100">{item.name}</p>
                    <m.span
                      animate={{
                        opacity: filtering ? 1 : 0,
                        color: item.match ? 'rgb(125,211,252)' : 'rgb(113,113,122)',
                      }}
                      className="shrink-0 font-mono text-[10px] tabular-nums"
                    >
                      %{item.score}
                    </m.span>
                  </div>
                  <p className="text-[10px] text-zinc-500">{item.hint}</p>
                </div>
              </div>
              {filtering ? (
                <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <m.div
                    className={cn(
                      'h-full rounded-full',
                      item.match ? 'bg-sky-400' : 'bg-zinc-600'
                    )}
                    initial={{ width: '0%' }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 0.7, ease: easePremium, delay: 0.1 + i * 0.08 }}
                  />
                </div>
              ) : null}
              <AnimatePresence>
                {selected ? (
                  <m.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 flex items-center justify-between rounded-lg bg-sky-400/15 px-2.5 py-2"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200">
                      Kurulum için seçildi
                    </span>
                    <m.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-400 text-zinc-950"
                    >
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                    </m.span>
                  </m.div>
                ) : null}
              </AnimatePresence>
            </m.div>
          );
        })}
      </div>
    </div>
  );
}

function DeployVisual({ active }: { active: boolean }) {
  const modules = [
    { label: 'Template', detail: 'nook-muhasebe/v2', pct: 100 },
    { label: 'Script', detail: 'e-fatura + gider akışı', pct: 100 },
    { label: 'Entegrasyon', detail: 'ERP webhook · S3', pct: 100 },
    { label: 'Go-live', detail: 'healthcheck OK', pct: 100 },
  ];
  const [line, setLine] = useState(0);

  useEffect(() => {
    if (!active) {
      setLine(0);
      return;
    }
    setLine(0);
    const id = window.setInterval(() => {
      setLine((n) => (n >= 5 ? n : n + 1));
    }, 900);
    return () => window.clearInterval(id);
  }, [active]);

  const logs = [
    { text: '$ bn deploy --agent nook-muhasebe', tone: 'cmd' as const },
    { text: '→ pulling modular image… 184MB', tone: 'info' as const },
    { text: '→ wiring e-fatura + CRM webhooks', tone: 'info' as const },
    { text: '→ seeding chart of accounts (TR)', tone: 'info' as const },
    { text: '→ healthcheck passed · 2h 14m', tone: 'ok' as const },
    { text: '✓ live · tenant: şantiye-alpha', tone: 'ok' as const },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-teal-400/15 px-2 py-0.5 text-[10px] font-semibold text-teal-200">
            NOOK Muhasebe
          </span>
          <span className="text-[10px] text-zinc-500">otomatik dağıtım</span>
        </div>
        <m.span
          animate={{ opacity: line >= 5 ? 1 : 0.4 }}
          className="font-mono text-[10px] tabular-nums text-zinc-400"
        >
          ETA {line >= 5 ? '0m' : `${Math.max(0, 5 - line) * 18}m`}
        </m.span>
      </div>
      <div className="grid gap-0 sm:grid-cols-[1.2fr_0.8fr]">
        <div className="border-b border-white/[0.06] p-3 font-mono text-[11px] leading-6 sm:border-b-0 sm:border-r sm:p-4 sm:text-xs">
          {logs.map((row, i) => (
            <m.p
              key={row.text}
              animate={{
                opacity: line > i ? 1 : 0.15,
                x: line > i ? 0 : -4,
                color:
                  row.tone === 'ok' && line > i
                    ? 'rgb(94,234,212)'
                    : row.tone === 'cmd'
                      ? 'rgb(186,230,253)'
                      : 'rgb(161,161,170)',
              }}
              transition={{ duration: duration.fast, ease: easePremium }}
            >
              {row.text}
            </m.p>
          ))}
          {active && line < logs.length ? (
            <m.span
              className="inline-block h-3.5 w-1.5 bg-sky-300/80"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              aria-hidden
            />
          ) : null}
        </div>

        <div className="space-y-3 p-3 sm:p-4">
          {modules.map((mod, i) => {
            const ready = line > i;
            return (
              <div key={mod.label}>
                <div className="mb-1 flex items-center justify-between gap-2 text-[10px]">
                  <span className="inline-flex min-w-0 items-center gap-1.5 text-zinc-400">
                    {i < 2 ? (
                      <Server className="h-3 w-3 shrink-0" aria-hidden />
                    ) : (
                      <Wrench className="h-3 w-3 shrink-0" aria-hidden />
                    )}
                    <span className="truncate">
                      <span className="font-medium text-zinc-300">{mod.label}</span>
                      <span className="ml-1.5 text-zinc-600">{mod.detail}</span>
                    </span>
                  </span>
                  <m.span
                    animate={{ opacity: ready ? 1 : 0.35 }}
                    className="shrink-0 tabular-nums text-zinc-400"
                  >
                    {ready ? '100%' : '…'}
                  </m.span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <m.div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400/80 to-teal-300/90"
                    initial={{ width: '6%' }}
                    animate={{ width: ready ? '100%' : '6%' }}
                    transition={{ duration: 0.65, ease: easePremium }}
                  />
                </div>
              </div>
            );
          })}
          <m.div
            animate={{ opacity: line >= 5 ? 1 : 0, y: line >= 5 ? 0 : 6 }}
            className="rounded-lg border border-teal-400/25 bg-teal-400/[0.08] px-2.5 py-2 text-center text-[10px] font-semibold text-teal-100"
          >
            Haftalar → saatler · canlı ortam hazır
          </m.div>
        </div>
      </div>
    </div>
  );
}

function SecureVisual({ active }: { active: boolean }) {
  const checks = [
    { label: 'Lokasyon / veri egemenliği', detail: 'TR · İstanbul AZ', icon: Server },
    { label: 'KVKK & regülasyon', detail: 'politika eşlemesi', icon: Lock },
    { label: 'Mühendis onayı', detail: 'uzman ağı · 2 reviewer', icon: HardHat },
    { label: 'Güvenlik taraması', detail: 'CVE + secrets scan', icon: ShieldCheck },
  ];
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (!active) {
      setDone(0);
      return;
    }
    setDone(0);
    let n = 0;
    const total = 4;
    const id = window.setInterval(() => {
      n += 1;
      setDone(Math.min(total, n));
      if (n >= total) window.clearInterval(id);
    }, 1100);
    return () => window.clearInterval(id);
  }, [active]);

  const progress = done / checks.length;
  const complete = done >= checks.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e] p-4">
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64" aria-hidden>
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="4"
            />
            <m.circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="rgb(125,211,252)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={175.9}
              animate={{ strokeDashoffset: 175.9 * (1 - progress) }}
              transition={{ duration: duration.base, ease: easePremium }}
            />
          </svg>
          <m.div
            animate={active && !complete ? { rotate: [0, 360] } : { rotate: 0 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-1 rounded-full border border-dashed border-sky-400/25"
            aria-hidden
          />
          <ShieldCheck className="relative h-6 w-6 text-sky-300" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-zinc-200">
            {complete ? 'Kontroller tamam · onaylandı' : 'Denetim sürüyor…'}
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">
            {Math.round(progress * 100)}% · uzman ağı + altyapı · NOOK Muhasebe
          </p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
            <m.div
              className="h-full rounded-full bg-sky-400/70"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: duration.fast, ease: easePremium }}
            />
          </div>
        </div>
      </div>

      <ul className="space-y-2">
        {checks.map((item, i) => {
          const Icon = item.icon;
          const ready = done > i;
          const current = done === i;
          return (
            <m.li
              key={item.label}
              animate={{
                opacity: ready || current ? 1 : 0.35,
                borderColor: ready
                  ? 'rgba(56,189,248,0.35)'
                  : current
                    ? 'rgba(255,255,255,0.18)'
                    : 'rgba(255,255,255,0.06)',
                backgroundColor: ready
                  ? 'rgba(56,189,248,0.08)'
                  : 'rgba(255,255,255,0.02)',
              }}
              className="relative flex items-center gap-2.5 overflow-hidden rounded-xl border px-3 py-2.5 text-xs text-zinc-300"
            >
              {current ? (
                <m.span
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-sky-400/10 to-transparent"
                  animate={{ x: ['-100%', '320%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  aria-hidden
                />
              ) : null}
              <Icon
                className={cn('relative h-3.5 w-3.5', ready ? 'text-sky-300' : 'text-zinc-600')}
                aria-hidden
              />
              <span className="relative min-w-0 flex-1">
                <span className="block font-medium">{item.label}</span>
                <span className="block text-[10px] text-zinc-500">{item.detail}</span>
              </span>
              {ready ? (
                <m.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative flex h-5 w-5 items-center justify-center rounded-full bg-sky-400/20 text-sky-300"
                >
                  <Check className="h-3 w-3" aria-hidden />
                </m.span>
              ) : current ? (
                <m.span
                  className="relative h-2 w-2 rounded-full bg-amber-300"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  aria-hidden
                />
              ) : (
                <span className="relative text-[10px] text-zinc-600">bekliyor</span>
              )}
            </m.li>
          );
        })}
      </ul>
    </div>
  );
}

function OperateVisual({ active }: { active: boolean }) {
  const agents = useMemo(() => getHeroAgents().slice(0, 6), []);
  const [dept, setDept] = useState(0);
  const [feed, setFeed] = useState(0);
  const [showSuggest, setShowSuggest] = useState(false);

  const feedLines = [
    { who: 'NOOK Muhasebe', what: '12 fatura eşleştirildi', when: 'şimdi' },
    { who: 'Chatwoot', what: '3 ticket otomatik yanıtlandı', when: '2dk' },
    { who: 'Metabase', what: 'haftalık maliyet özeti hazır', when: '5dk' },
  ];

  useEffect(() => {
    if (!active) {
      setDept(0);
      setFeed(0);
      setShowSuggest(false);
      return;
    }
    const deptId = window.setInterval(() => {
      setDept((d) => (d + 1) % DEPARTMENTS.length);
    }, 2200);
    const feedId = window.setInterval(() => {
      setFeed((n) => (n + 1) % feedLines.length);
    }, 1800);
    const suggestId = window.setTimeout(() => setShowSuggest(true), 2800);
    return () => {
      window.clearInterval(deptId);
      window.clearInterval(feedId);
      window.clearTimeout(suggestId);
    };
  }, [active, feedLines.length]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#0e0e10] shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-white/25" />
        <span className="ml-3 text-[11px] font-semibold tracking-wide text-zinc-500">
          Blacknook Otonom · /agent
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-emerald-300/90">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Canlı
        </span>
      </div>
      <div className="grid grid-cols-[6.5rem_1fr] sm:grid-cols-[9rem_1fr]">
        <aside className="border-r border-white/[0.06] bg-white/[0.02] p-3">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
            Departman
          </p>
          <ul className="space-y-1.5">
            {DEPARTMENTS.map((d, i) => (
              <m.li
                key={d.name}
                animate={{
                  opacity: active ? 1 : 0.35,
                  backgroundColor: i === dept ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0)',
                }}
                transition={{ duration: duration.fast }}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px]',
                  i === dept ? 'text-zinc-50' : 'text-zinc-500'
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
            <p className="text-xs font-semibold text-zinc-200">
              {DEPARTMENTS[dept]?.name} ajanları
            </p>
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
                animate={active ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 4 }}
                transition={{ delay: 0.05 + i * 0.06, duration: duration.fast }}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border p-3',
                  a.slug === 'chatwoot' || a.name.toLowerCase().includes('muhasebe')
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

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
              <MessageSquare className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden />
              <AnimatePresence mode="wait">
                <m.p
                  key={feed}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="min-w-0 flex-1 truncate text-[11px] text-zinc-300"
                >
                  <span className="font-semibold text-zinc-100">{feedLines[feed]?.who}</span>
                  <span className="text-zinc-500"> · </span>
                  {feedLines[feed]?.what}
                </m.p>
              </AnimatePresence>
              <span className="shrink-0 text-[10px] text-zinc-600">{feedLines[feed]?.when}</span>
            </div>

            <AnimatePresence>
              {showSuggest ? (
                <m.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-2 rounded-xl border border-amber-400/25 bg-amber-400/[0.08] px-3 py-2.5"
                >
                  <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-amber-100">Proaktif öneri</p>
                    <p className="mt-0.5 text-[10px] leading-relaxed text-amber-100/70">
                      Şantiye giderlerinde tekrarlayan kalemler tespit edildi. Stok ajanı eklenirse
                      %12 maliyet tasarrufu potansiyeli.
                    </p>
                  </div>
                </m.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepVisual({ stepId, active }: { stepId: OpsStep['id']; active: boolean }) {
  switch (stepId) {
    case 'discover':
      return <DiscoverVisual active={active} />;
    case 'deploy':
      return <DeployVisual active={active} />;
    case 'secure':
      return <SecureVisual active={active} />;
    case 'operate':
      return <OperateVisual active={active} />;
    default:
      return null;
  }
}

const STEP_ICONS = {
  discover: Radar,
  deploy: Rocket,
  secure: ShieldCheck,
  operate: Sparkles,
} as const;

function OpsStepBlock({ step, index }: { step: OpsStep; index: number }) {
  const reduce = useReducedMotion();
  const { ref, active } = useInViewActive(reduce);
  const Icon = STEP_ICONS[step.id];
  const isLast = index === OPS_MODEL.steps.length - 1;

  return (
    <li className="relative flex gap-4 pb-10 last:pb-0 sm:gap-6 sm:pb-14">
      <div className="relative flex w-8 shrink-0 flex-col items-center sm:w-10">
        <m.span
          animate={{
            borderColor: active ? 'rgba(56,189,248,0.45)' : 'rgba(255,255,255,0.15)',
            backgroundColor: active ? 'rgba(56,189,248,0.12)' : 'rgba(255,255,255,0.06)',
            color: active ? 'rgb(186,230,253)' : 'rgb(228,228,231)',
          }}
          className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border sm:h-10 sm:w-10"
          aria-hidden
        >
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </m.span>
        {!isLast ? (
          <span
            aria-hidden
            className="absolute top-8 bottom-0 w-px bg-white/15 sm:top-10"
          />
        ) : null}
      </div>

      <PitchScrollReveal delay={index * 0.06} className="min-w-0 flex-1">
        <div
          ref={ref}
          className="w-full rounded-2xl border border-white/10 bg-[var(--bn-card-bg)] px-4 py-4 sm:px-5 sm:py-5"
        >
          <div className="mb-2">
            <h3 className="font-display text-base font-semibold tracking-tight text-[var(--bn-heading)] sm:text-lg">
              {step.title}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-[var(--bn-subtitle)] sm:text-[15px] sm:leading-7">
            {step.body}
          </p>
          <div className="mt-4">
            <StepVisual stepId={step.id} active={active} />
          </div>
        </div>
      </PitchScrollReveal>
    </li>
  );
}

export function PitchOpsModel() {
  return (
    <section id="model" className="relative">
      <div className="relative mx-auto w-full max-w-3xl px-4 py-16 md:max-w-4xl md:px-6 md:py-24">
        <PitchScrollReveal>
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--bn-faint)]">
            {OPS_MODEL.badge}
          </p>
          <h2 className="mt-3 text-center font-display text-2xl font-semibold tracking-tight text-[var(--bn-heading)] sm:text-3xl">
            {OPS_MODEL.title}
          </h2>
        </PitchScrollReveal>

        <ol className="relative mt-10 sm:mt-12">
          {OPS_MODEL.steps.map((step, index) => (
            <OpsStepBlock key={step.id} step={step} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}
