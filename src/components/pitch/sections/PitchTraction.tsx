'use client';

import { PitchAnimatedCounter } from '@/components/pitch/ui/PitchAnimatedCounter';
import { PitchGlowCard } from '@/components/pitch/ui/PitchGlowCard';
import { PitchScrollReveal } from '@/components/pitch/ui/PitchScrollReveal';
import { PitchSectionShell } from '@/components/pitch/ui/PitchSectionShell';
import { TRACTION_STATS } from '@/lib/pitchData';

export function PitchTraction() {
  return (
    <PitchSectionShell
      id="traction"
      badge="TRACTION"
      title="Traction"
      subtitle="Canlı ürün yüzeyi. Gelir metrikleri görüşmede."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TRACTION_STATS.map((stat, idx) => (
          <PitchScrollReveal key={stat.label} delay={idx * 0.05}>
            <PitchGlowCard color="teal" className="text-center">
              <div className="font-display text-4xl font-bold tracking-tight text-zinc-50 md:text-5xl">
                <PitchAnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-2 text-xs text-zinc-500 sm:text-sm">{stat.label}</div>
            </PitchGlowCard>
          </PitchScrollReveal>
        ))}
      </div>
    </PitchSectionShell>
  );
}
