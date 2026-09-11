'use client';

import { useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { PitchGlowCard } from '@/components/pitch/ui/PitchGlowCard';
import { PitchScrollReveal } from '@/components/pitch/ui/PitchScrollReveal';
import { PITCH_GRANTS } from '@/lib/pitchData';
import { duration, easePremium } from '@/components/motion/tokens';
import { cn } from '@/lib/utils';

export function PitchGrants() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="hibe-tesvik" className="relative">
      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <PitchScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--bn-faint)]">
              Finansman
            </p>
            <h2 className="mt-3 font-display text-xl font-semibold tracking-tight text-[var(--bn-heading)] sm:text-2xl md:text-[1.65rem]">
              Proje Kapsamı Dahilindeki Hibe ve Teşvik Programları
            </h2>
          </div>
        </PitchScrollReveal>

        <ul className="mt-10 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {PITCH_GRANTS.map((grant, index) => {
            const open = openId === grant.id;
            return (
              <PitchScrollReveal key={grant.id} delay={Math.min(index * 0.03, 0.24)}>
                <li className="h-full">
                  <PitchGlowCard color="white" flush className="flex h-full flex-col overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : grant.id)}
                      aria-expanded={open}
                      className="flex w-full items-start gap-3 px-4 py-4 text-left sm:px-5 sm:py-5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-[15px] font-semibold leading-snug text-[var(--bn-heading)] sm:text-base">
                          {grant.title}
                        </p>
                        {grant.subtitle ? (
                          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-sky-300/80 sm:text-xs">
                            {grant.subtitle}
                          </p>
                        ) : null}
                        <p className="mt-2 text-[11px] leading-relaxed text-zinc-500 sm:text-xs">
                          {grant.limits}
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
                          transition={{ duration: 0.3, ease: easePremium }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/[0.06] px-4 pb-5 pt-3 sm:px-5">
                            <p className="text-sm leading-relaxed text-[var(--bn-subtitle)]">
                              {grant.body}
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
        </ul>
      </div>
    </section>
  );
}
