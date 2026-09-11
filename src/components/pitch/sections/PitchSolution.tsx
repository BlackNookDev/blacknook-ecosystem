'use client';

import { Check, X } from 'lucide-react';
import { m } from 'framer-motion';
import { PitchScrollReveal } from '@/components/pitch/ui/PitchScrollReveal';
import { PitchSectionShell } from '@/components/pitch/ui/PitchSectionShell';
import { SOLUTION_COMPARISON, SOLUTION_INTRO } from '@/lib/pitchData';
import { duration, easePremium } from '@/components/motion/tokens';
import { cn } from '@/lib/utils';

function Cell({ text, variant }: { text: string; variant: 'pain' | 'benefit' }) {
  const Icon = variant === 'pain' ? X : Check;
  return (
    <div className="flex items-start gap-3 text-zinc-200">
      <Icon
        size={18}
        strokeWidth={2}
        aria-hidden
        className={cn(
          'mt-0.5 shrink-0',
          variant === 'pain' ? 'text-zinc-500' : 'text-teal-300/90'
        )}
      />
      <span className="text-sm leading-relaxed sm:text-base">{text}</span>
    </div>
  );
}

export function PitchSolution() {
  return (
    <PitchSectionShell
      id="cozum"
      badge="ÇÖZÜM"
      title="Çözüm"
      subtitle={SOLUTION_INTRO}
    >
      <PitchScrollReveal>
        <div className="mx-auto w-full max-w-4xl text-left">
          <div className="mb-4 grid grid-cols-2 gap-4 md:mb-6 md:gap-x-12 lg:gap-x-20">
            <h3 className="font-display text-sm font-semibold text-zinc-400 sm:text-base">
              Mevcut durum
            </h3>
            <h3 className="font-display text-sm font-semibold text-teal-300/90 sm:text-base">
              Blacknook ile
            </h3>
          </div>
          <div role="table" aria-label="Mevcut durum ile Blacknook karşılaştırması">
            {SOLUTION_COMPARISON.map((row, index) => (
              <m.div
                key={row.pain}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: duration.base,
                  ease: easePremium,
                  delay: index * 0.06,
                }}
                className="grid gap-4 border-b border-white/[0.06] py-4 last:border-b-0 md:grid-cols-2 md:gap-x-12 md:py-5 lg:gap-x-20"
              >
                <Cell text={row.pain} variant="pain" />
                <Cell text={row.benefit} variant="benefit" />
              </m.div>
            ))}
          </div>
        </div>
      </PitchScrollReveal>
    </PitchSectionShell>
  );
}
