'use client';

import { PitchPipelineDemo } from '@/components/pitch/ui/PitchPipelineDemo';
import { PitchScrollReveal } from '@/components/pitch/ui/PitchScrollReveal';

/** Pipeline animasyonu — ürün kart grid’i kaldırıldı. */
export function PitchProduct() {
  return (
    <section id="urun" className="relative">
      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <h2 className="sr-only">Ürün yol haritası</h2>
        <PitchScrollReveal>
          <PitchPipelineDemo />
        </PitchScrollReveal>
      </div>
    </section>
  );
}
