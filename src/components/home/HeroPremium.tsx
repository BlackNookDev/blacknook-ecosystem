'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { ArrowRight, Bot, Sparkles } from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import MaskedText from '@/components/motion/MaskedText';
import { fadeUp, staggerContainer } from '@/components/motion/tokens';
import { NOOK_AGENT_LAUNCH_PATH } from '@/lib/nookAgent';

const STATS = [
  { value: '7', label: 'MCP' },
  { value: '100+', label: 'MCP ajanı' },
  { value: '16', label: 'Departman' },
] as const;

export default function HeroPremium() {
  const reduce = useReducedMotion();
  const { data: session } = useSession();
  const panelHref = session?.user
    ? NOOK_AGENT_LAUNCH_PATH
    : `/login?callbackUrl=${encodeURIComponent(NOOK_AGENT_LAUNCH_PATH)}`;

  return (
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden px-6 pb-10 pt-28 text-center sm:px-10 sm:pb-12 sm:pt-32 md:pt-36">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-[42%] h-[50vmin] w-[85vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12)_0%,transparent_68%)] blur-2xl" />
        <div className="absolute left-1/2 top-[38%] h-[32vmin] w-[55vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)] blur-xl" />
      </div>

      <m.div
        className="relative z-10 flex max-w-4xl flex-col items-center"
        variants={reduce ? undefined : staggerContainer}
        initial={reduce ? false : 'hidden'}
        animate="visible"
      >
        <m.div variants={reduce ? undefined : fadeUp}>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-100">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Blacknook Otonom
          </span>
        </m.div>

        <m.div className="mt-6" variants={reduce ? undefined : fadeUp}>
          <div className="mb-5 flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-500/10 shadow-[0_12px_40px_rgba(16,185,129,0.12)] sm:h-[4.5rem] sm:w-[4.5rem]">
              <Image
                src="/bn-mark.png"
                alt=""
                width={36}
                height={36}
                className="h-9 w-9 object-contain sm:h-10 sm:w-10"
                priority
              />
            </span>
          </div>
          <MaskedText
            as="h1"
            onMount
            delay={reduce ? 0 : 0.1}
            className="font-display text-[clamp(2rem,5.5vw,3.75rem)] font-bold leading-[1.08] tracking-[-0.03em] text-zinc-50"
            lines={['İşletmenizin otonom', 'operasyon paneli']}
          />
        </m.div>

        <m.div
          variants={reduce ? undefined : fadeUp}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href={panelHref}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-zinc-950 transition-opacity hover:opacity-90"
          >
            <Bot className="h-4 w-4" aria-hidden />
            Panele gir
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
          >
            Ekosistemi keşfet
          </Link>
        </m.div>

        <m.ul
          variants={reduce ? undefined : fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10"
        >
          {STATS.map((stat) => (
            <li key={stat.label} className="text-center">
              <p className="font-display text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--bn-faint)]">
                {stat.label}
              </p>
            </li>
          ))}
        </m.ul>
      </m.div>
    </section>
  );
}
