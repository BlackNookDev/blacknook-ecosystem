'use client';

import { PitchComparisonTable } from '@/components/pitch/ui/PitchComparisonTable';
import { PitchGlowCard } from '@/components/pitch/ui/PitchGlowCard';
import { PitchScrollReveal } from '@/components/pitch/ui/PitchScrollReveal';
import { PitchSectionShell } from '@/components/pitch/ui/PitchSectionShell';
import { COMPETITION, COMPETITIVE_ADVANTAGE } from '@/lib/pitchData';

export function PitchCompetition() {
  return (
    <PitchSectionShell id="rekabet" badge="REKABET" title="Rekabet Analizi">
      <PitchGlowCard flush color="white">
        <PitchComparisonTable headers={COMPETITION.headers} rows={COMPETITION.rows} />
      </PitchGlowCard>

      <PitchScrollReveal className="mt-10 md:mt-12">
        <div className="mx-auto w-full max-w-3xl">
          <h3 className="font-display text-sm font-semibold text-teal-300/90 sm:text-base">
            Rekabet avantajı
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {COMPETITIVE_ADVANTAGE.map((text, idx) => (
              <PitchScrollReveal key={text} delay={idx * 0.05}>
                <PitchGlowCard color="teal">
                  <p className="text-sm leading-relaxed text-zinc-200 sm:text-base">{text}</p>
                </PitchGlowCard>
              </PitchScrollReveal>
            ))}
          </ul>
        </div>
      </PitchScrollReveal>
    </PitchSectionShell>
  );
}
