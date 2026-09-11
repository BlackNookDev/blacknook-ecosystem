'use client';

import { PitchGlowCard } from '@/components/pitch/ui/PitchGlowCard';
import { PitchScrollReveal } from '@/components/pitch/ui/PitchScrollReveal';
import { PitchSectionShell } from '@/components/pitch/ui/PitchSectionShell';
import { PROBLEM_HIGHLIGHTS, PROBLEM_INTRO } from '@/lib/pitchData';

export function PitchProblem() {
  return (
    <PitchSectionShell id="problem" badge="PROBLEM" title="Problem" subtitle={PROBLEM_INTRO}>
      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
        {PROBLEM_HIGHLIGHTS.map((item, index) => (
          <PitchScrollReveal key={item.id} delay={index * 0.06}>
            <PitchGlowCard color={index === 1 ? 'white' : 'teal'} className="h-full">
              <p className="font-display text-sm font-semibold text-zinc-50">{item.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{item.text}</p>
            </PitchGlowCard>
          </PitchScrollReveal>
        ))}
      </div>
    </PitchSectionShell>
  );
}
