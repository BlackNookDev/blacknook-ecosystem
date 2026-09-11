'use client';

import { PitchGlowCard } from '@/components/pitch/ui/PitchGlowCard';
import { PitchScrollReveal } from '@/components/pitch/ui/PitchScrollReveal';
import { PitchTeamAvatar } from '@/components/pitch/ui/PitchTeamAvatar';
import { PITCH_TEAM } from '@/lib/pitchData';

export function PitchTeam() {
  return (
    <section id="ekip" className="relative">
      <div className="relative mx-auto w-full max-w-4xl px-4 py-16 md:px-6 md:py-24">
        <PitchScrollReveal>
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--bn-faint)]">
            Ekip
          </p>
        </PitchScrollReveal>

        <PitchScrollReveal delay={0.08}>
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-5 md:gap-6">
            {PITCH_TEAM.map((member) => (
              <li key={member.id} className="min-w-0">
                <PitchGlowCard color="white" flush className="h-full overflow-hidden">
                  <div className="relative aspect-square overflow-hidden bg-[var(--bn-elevated)]">
                    <PitchTeamAvatar
                      name={member.name}
                      gender={member.gender}
                      accent={member.accent}
                      className="h-full w-full"
                    />
                  </div>
                  <div className="px-3 py-3.5 text-center sm:px-4 sm:py-4">
                    <p className="font-display text-[15px] font-semibold leading-snug text-[var(--bn-heading)] sm:text-base">
                      {member.name}
                    </p>
                    <p className="mt-1.5 text-xs leading-snug text-zinc-400 sm:text-[13px]">
                      {member.title}
                    </p>
                  </div>
                </PitchGlowCard>
              </li>
            ))}
          </ul>
        </PitchScrollReveal>
      </div>
    </section>
  );
}
