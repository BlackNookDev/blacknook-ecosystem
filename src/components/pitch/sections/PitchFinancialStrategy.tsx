'use client';

import { useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { PitchGlowCard } from '@/components/pitch/ui/PitchGlowCard';
import { PitchScrollReveal } from '@/components/pitch/ui/PitchScrollReveal';
import { PITCH_FINANCIAL_STRATEGY } from '@/lib/pitchData';
import { duration, easePremium } from '@/components/motion/tokens';
import { cn } from '@/lib/utils';

export function PitchFinancialStrategy() {
  const [openId, setOpenId] = useState<string | null>(PITCH_FINANCIAL_STRATEGY[0]?.id ?? null);

  return (
    <section id="finansal-strateji" className="relative">
      <div className="relative mx-auto w-full max-w-3xl px-4 py-16 md:max-w-4xl md:px-6 md:py-24">
        <PitchScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--bn-faint)]">
              Yol Haritası
            </p>
            <h2 className="mt-3 font-display text-xl font-semibold tracking-tight text-[var(--bn-heading)] sm:text-2xl md:text-[1.65rem]">
              Finansal Strateji Planlaması
            </h2>
          </div>
        </PitchScrollReveal>

        <ol className="mt-10 space-y-3 sm:mt-12 sm:space-y-3.5">
          {PITCH_FINANCIAL_STRATEGY.map((step, index) => {
            const open = openId === step.id;
            return (
              <PitchScrollReveal key={step.id} delay={Math.min(index * 0.03, 0.24)}>
                <li>
                  <PitchGlowCard color="white" flush className="overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : step.id)}
                      aria-expanded={open}
                      className="flex w-full items-start gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5 sm:py-5"
                    >
                      <span
                        className={cn(
                          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-display text-xs font-bold tabular-nums sm:h-9 sm:w-9 sm:text-sm',
                          open
                            ? 'border-sky-400/40 bg-sky-400/15 text-sky-200'
                            : 'border-white/12 bg-white/[0.04] text-zinc-400'
                        )}
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-[15px] font-semibold leading-snug text-[var(--bn-heading)] sm:text-base">
                          {step.title}
                        </p>
                        <p className="mt-1 text-[11px] leading-snug text-zinc-500 sm:text-xs">
                          {step.summary}
                        </p>
                      </div>
                      <m.span
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: duration.fast, ease: easePremium }}
                        className={cn(
                          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                          open
                            ? 'border-sky-400/30 bg-sky-400/10 text-sky-200'
                            : 'border-white/10 bg-white/[0.03] text-zinc-400'
                        )}
                      >
                        <ChevronDown className="h-4 w-4" aria-hidden />
                      </m.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {open ? (
                        <m.div
                          key="body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: easePremium }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/[0.06] px-4 pb-5 pt-3 sm:px-5 sm:pl-[4.25rem]">
                            <p className="text-sm leading-relaxed text-[var(--bn-subtitle)] sm:text-[15px] sm:leading-7">
                              {step.body}
                            </p>
                          </div>
                        </m.div>
                      ) : null}
                    </AnimatePresence>
                  </PitchGlowCard>
                </li>
              </PitchScrollReveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
