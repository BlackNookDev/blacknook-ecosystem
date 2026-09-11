'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { RefreshCw } from 'lucide-react';
import SimulationBackLink from '@/components/simulations/SimulationBackLink';
import NookMuhasebeSimulation from '@/components/simulations/nook-muhasebe/NookMuhasebeSimulation';
import { subscribeSimulationSplash } from '@/lib/simulationSplash';

export default function NookMuhasebeSimulationPage() {
  const [resetKey, setResetKey] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return subscribeSimulationSplash((splash) => {
      setReady(!splash.visible);
    });
  }, []);

  if (!ready) return null;

  return (
    <div className="fixed inset-0 z-10 flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[var(--bn-bg)]">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--bn-border)] bg-[var(--bn-nav-bg)] px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <SimulationBackLink fallback="/agent" aria-label="Panele dön" />
          <Image
            src="/bn-mark.png"
            alt=""
            width={22}
            height={22}
            className="h-5 w-5 shrink-0 object-contain brightness-0 invert"
          />
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-[var(--bn-heading)]">
              NOOK MCP Simülasyonu
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setResetKey((key) => key + 1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--bn-border)] bg-[var(--bn-chip-bg)] px-3 py-1.5 text-[12px] font-medium text-[var(--bn-chip-text)] transition hover:border-wa-accent/40 hover:text-emerald-200"
          >
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
            <span className="hidden sm:inline">Sistemi sıfırla</span>
          </button>
          <span className="hidden rounded-full border border-wa-accent/35 bg-wa-accent/10 px-3 py-1 text-[11px] font-semibold text-emerald-200 md:inline">
            Blacknook · Önizleme
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden p-3 sm:p-4">
        <NookMuhasebeSimulation key={resetKey} />
      </div>
    </div>
  );
}
