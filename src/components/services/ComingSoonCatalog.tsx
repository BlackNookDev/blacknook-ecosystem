'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import type { ComingSoonCopy } from '../../../lib/catalogChannels';
import { duration, easePremium } from '@/components/motion/tokens';

type Props = {
  copy: ComingSoonCopy;
};

export default function ComingSoonCatalog({ copy }: Props) {
  const reduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent px-6 py-16 text-center sm:px-10 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(56,189,248,0.12),transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
        {!reduce ? (
          <>
            <m.span
              className="absolute inset-0 rounded-full border border-sky-400/30"
              animate={{ scale: [1, 1.35, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
            />
            <m.span
              className="absolute inset-1 rounded-full border border-emerald-400/25"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
            />
          </>
        ) : null}
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-zinc-900/80 shadow-[0_0_24px_rgba(56,189,248,0.15)]">
          <Sparkles className="h-5 w-5 text-sky-300" aria-hidden />
        </span>
      </div>

      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300/90">
        {copy.eyebrow}
      </p>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {copy.title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-400">{copy.body}</p>

      <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-zinc-500">
        {copy.bullets.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/services"
          className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-white px-4 text-sm font-bold text-black transition-opacity hover:opacity-90"
        >
          Ekosistemi keşfet
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>

      <m.p
        className="mt-6 text-[11px] text-zinc-600"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: duration.base, ease: easePremium }}
      >
        Kurulum talepleri şu an Ekosistem hub’ında açık.
      </m.p>
    </div>
  );
}
