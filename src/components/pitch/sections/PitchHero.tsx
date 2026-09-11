'use client';

import Image from 'next/image';
import { m, useReducedMotion } from 'framer-motion';
import { FOREWORD } from '@/lib/pitchData';
import { duration, easePremium } from '@/components/motion/tokens';

export function PitchHero() {
  const reduce = useReducedMotion();

  return (
    <section id="hero" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-[radial-gradient(ellipse_70%_80%_at_50%_0%,rgba(255,255,255,0.04),transparent_72%)]"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-24 sm:px-6 md:px-8 md:py-32">
        <m.div
          className="relative flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16 md:h-[4.5rem] md:w-[4.5rem]"
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          animate={
            reduce
              ? { opacity: 1, scale: 1 }
              : { opacity: [1, 0.28, 1], scale: 1 }
          }
          transition={
            reduce
              ? { duration: duration.scene, ease: easePremium }
              : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <span
            aria-hidden
            className="absolute -inset-6 rounded-full bg-white/[0.08] blur-2xl"
          />
          <Image
            src="/brand/bn-logo.png"
            alt="Blacknook"
            width={72}
            height={72}
            priority
            className="relative h-full w-full object-contain bn-logo-mark"
          />
        </m.div>

        <div className="mt-14 w-full max-w-5xl text-center md:mt-16 lg:max-w-6xl">
          <div className="mx-auto space-y-6 text-sm leading-relaxed text-zinc-300 sm:text-[15px] sm:leading-7 md:space-y-7 md:text-base md:leading-8">
            {FOREWORD.paragraphs.map((p, i) => (
              <m.p
                key={p.slice(0, 48)}
                className="mx-auto max-w-none"
                initial={reduce ? false : { opacity: 0, y: -28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.35,
                  ease: easePremium,
                  delay: reduce ? 0 : 0.55 + i * 0.55,
                }}
              >
                {p}
              </m.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
