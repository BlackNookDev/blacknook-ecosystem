'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bot, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import { useTranslations } from '@/components/LocaleProvider';
import { duration, easePremium } from '@/components/motion/tokens';
import { NOOK_AGENT_LAUNCH_PATH } from '@/lib/nookAgent';
import { getHeroAgents, type ServiceCatalogEntry } from '../../../lib/data';

type FloatingStyle = {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  rotate: number;
};

const FLOATING_LAYOUT: Record<string, FloatingStyle> = {
  'nook-muhasebe-mcp': { top: '10%', left: '8%', rotate: -12 },
  'cal-com': { top: '14%', right: '10%', rotate: 10 },
  metabase: { top: '40%', left: '5%', rotate: 8 },
  plausible: { top: '44%', right: '6%', rotate: -8 },
  chatwoot: { bottom: '18%', left: '7%', rotate: -6 },
  outline: { bottom: '16%', right: '11%', rotate: 14 },
};

const FLOATING_FALLBACK: FloatingStyle[] = [
  { top: '10%', left: '8%', rotate: -12 },
  { top: '14%', right: '10%', rotate: 10 },
  { top: '40%', left: '5%', rotate: 8 },
  { top: '44%', right: '6%', rotate: -8 },
  { bottom: '18%', left: '7%', rotate: -6 },
  { bottom: '16%', right: '11%', rotate: 14 },
];

type FloatingItem = ServiceCatalogEntry & {
  style: FloatingStyle;
  delay: number;
};

function FloatingIcon({
  item,
  reduce,
}: {
  item: FloatingItem;
  reduce: boolean | null;
}) {
  const { rotate } = item.style;

  return (
    <m.div
      className="group/icon absolute"
      style={{
        top: item.style.top,
        left: item.style.left,
        right: item.style.right,
        bottom: item.style.bottom,
        rotate: `${rotate}deg`,
      }}
      animate={
        reduce
          ? undefined
          : {
              y: [0, -8, 0],
              rotate: [rotate, rotate + 3, rotate],
            }
      }
      transition={{
        duration: 5 + item.delay,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: item.delay,
      }}
    >
      <div className="pointer-events-auto flex flex-col items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bn-icon-tile shadow-[0_8px_28px_rgba(0,0,0,0.12)] transition group-hover/icon:scale-105 lg:h-11 lg:w-11">
          <ServiceCatalogLogo
            icon={item.icon}
            brandColor={item.brandColor}
            name={item.name}
            size="sm"
          />
        </div>
        <Link
          href={`/service/${item.slug}`}
          className="pointer-events-none rounded-full border border-white/10 bg-black/70 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-zinc-200 opacity-0 backdrop-blur-sm transition group-hover/icon:pointer-events-auto group-hover/icon:opacity-100"
        >
          Ajan
        </Link>
      </div>
    </m.div>
  );
}

export default function HomeProductShowcase() {
  const reduce = useReducedMotion();
  const { t: th } = useTranslations('home');
  const agents = useMemo(() => getHeroAgents(), []);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const floating = useMemo<FloatingItem[]>(
    () =>
      agents.slice(0, 6).map((item, i) => ({
        ...item,
        style: FLOATING_LAYOUT[item.slug] ?? FLOATING_FALLBACK[i],
        delay: i * 0.35,
      })),
    [agents]
  );

  const active = agents[index];
  const count = agents.length;

  const go = useCallback(
    (next: number) => {
      if (!count) return;
      setDirection(next > index ? 1 : -1);
      setIndex((next + count) % count);
    },
    [count, index]
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (reduce || count < 2) return;
    const timer = window.setInterval(next, 6000);
    return () => window.clearInterval(timer);
  }, [next, reduce, count]);

  if (!active) return null;

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 36 : -36 }),
    center: { x: 0 },
    exit: (d: number) => ({ x: d > 0 ? -36 : 36 }),
  };

  return (
    <section
      className="relative w-full overflow-hidden px-4 pb-10 pt-28 sm:px-6 sm:pb-14 sm:pt-32"
      aria-label={th('featuredAgents')}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-[38%] h-[42vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--bn-bg,#050505)] to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
        {floating.map((item) => (
          <FloatingIcon key={item.slug} item={item} reduce={reduce} />
        ))}
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl bn-card-solid">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              background: `radial-gradient(circle at 30% 20%, ${active.brandColor}44, transparent 58%)`,
            }}
            aria-hidden
          />

          <div className="relative grid min-h-[22rem] grid-cols-1 items-center gap-6 p-6 sm:min-h-[24rem] sm:p-8 md:grid-cols-[1fr_1.1fr] md:gap-10">
            <div className="flex items-center justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <m.div
                  key={active.slug}
                  custom={direction}
                  variants={reduce ? undefined : slideVariants}
                  initial={reduce ? false : 'enter'}
                  animate="center"
                  exit={reduce ? undefined : 'exit'}
                  transition={{ duration: duration.base, ease: easePremium }}
                  drag={reduce ? false : 'x'}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.12}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -72 || info.velocity.x < -400) next();
                    else if (info.offset.x > 72 || info.velocity.x > 400) prev();
                  }}
                  className="flex flex-col items-center text-center md:items-start md:text-left"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bn-icon-tile shadow-lg sm:h-24 sm:w-24">
                    <ServiceCatalogLogo
                      icon={active.icon}
                      brandColor={active.brandColor}
                      name={active.name}
                      size="lg"
                      framed
                    />
                  </div>
                  <span className="bn-chip mt-4 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
                    {active.agentDepartment ?? th('heroAgentBadge')}
                  </span>
                </m.div>
              </AnimatePresence>
            </div>

            <div className="flex min-h-[12rem] flex-col justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <m.div
                  key={`${active.slug}-copy`}
                  custom={direction}
                  variants={reduce ? undefined : slideVariants}
                  initial={reduce ? false : 'enter'}
                  animate="center"
                  exit={reduce ? undefined : 'exit'}
                  transition={{ duration: duration.base, ease: easePremium }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-400/90">
                    {th('heroAgentBadge')}
                  </p>
                  <h2 className="bn-heading mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                    {active.name}
                  </h2>
                  <p className="bn-subtitle mt-3 text-sm leading-relaxed sm:text-base">
                    {active.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {active.features.slice(0, 3).map((feature) => (
                      <li key={feature} className="bn-chip rounded-lg px-2.5 py-1 text-xs">
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/service/${active.slug}`}
                      className="bn-cta inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-opacity hover:opacity-90"
                    >
                      {th('viewAgent')}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                    <Link
                      href={NOOK_AGENT_LAUNCH_PATH}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-white/25 hover:bg-white/[0.05]"
                    >
                      <Bot className="h-4 w-4" aria-hidden />
                      {th('openCockpit')}
                    </Link>
                  </div>
                </m.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="relative flex items-center justify-between border-t border-[var(--bn-card-border)] px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              {agents.map((agent, i) => (
                <button
                  key={agent.slug}
                  type="button"
                  onClick={() => go(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? 'bn-dot-active w-6' : 'bn-dot w-2 hover:opacity-80'
                  }`}
                  aria-label={th('goToSlide', { name: agent.name })}
                  aria-current={i === index ? 'true' : undefined}
                />
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prev}
                className="bn-icon-round inline-flex h-9 w-9 items-center justify-center rounded-full"
                aria-label={th('prevProduct')}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                className="bn-icon-round inline-flex h-9 w-9 items-center justify-center rounded-full"
                aria-label={th('nextProduct')}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
