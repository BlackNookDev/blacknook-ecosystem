'use client';

import Link from 'next/link';
import { m } from 'framer-motion';
import { PitchScrollReveal } from '@/components/pitch/ui/PitchScrollReveal';
import { PitchSectionBadge } from '@/components/pitch/ui/PitchSectionBadge';
import { VISION_TEXT } from '@/lib/pitchData';
import { NOOK_AGENT_LAUNCH_PATH } from '@/lib/nookAgent';
import { duration, easePremium } from '@/components/motion/tokens';

export function PitchVision() {
  return (
    <section id="vision" className="relative">
      <m.div
        className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-16 text-center md:px-6 md:py-20"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: duration.slow, ease: easePremium }}
      >
        <PitchSectionBadge text="Vision" />
        <p className="mt-6 max-w-2xl text-sm font-light leading-relaxed tracking-wide text-zinc-200 md:text-base lg:text-lg">
          {VISION_TEXT}
        </p>

        <PitchScrollReveal className="mt-8 w-full max-w-md">
          <Link
            href={NOOK_AGENT_LAUNCH_PATH}
            className="group block w-full rounded-2xl border border-white/12 bg-white/[0.04] px-5 py-5 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/[0.06]"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
              MVP
            </div>
            <div className="mt-1 font-display font-semibold text-zinc-50">
              Otonom paneli görüntüle
            </div>
            <div className="mt-1 text-sm text-zinc-400">Tıkla ve /agent’e git</div>
            <div className="mt-3 font-display text-teal-300/90 transition-transform group-hover:-translate-y-0.5">
              ↗
            </div>
          </Link>
        </PitchScrollReveal>
      </m.div>
    </section>
  );
}
