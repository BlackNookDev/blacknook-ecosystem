'use client';

import { PitchHero } from '@/components/pitch/sections/PitchHero';
import { PitchOpsModel } from '@/components/pitch/sections/PitchOpsModel';
import { PitchBusinessModel } from '@/components/pitch/sections/PitchBusinessModel';
import { PitchArgeProjects } from '@/components/pitch/sections/PitchArgeProjects';
import { PitchGrants } from '@/components/pitch/sections/PitchGrants';
import { PitchTeam } from '@/components/pitch/sections/PitchTeam';

/**
 * Pitch deck — SiteBackground üzerinde kesintisiz derinlik (bölüm çizgisi yok).
 */
export default function PitchPage() {
  return (
    <div className="relative isolate min-h-screen bg-transparent text-[var(--bn-text)]">
      <div className="relative z-10 flex min-h-screen flex-col">
        <main className="flex-1">
          <PitchHero />
          <PitchOpsModel />
          <PitchBusinessModel />
          <PitchArgeProjects />
          <PitchGrants />
          <PitchTeam />
        </main>
      </div>
    </div>
  );
}
