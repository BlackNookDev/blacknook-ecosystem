'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import FlowiseSimulation from '@/components/simulations/flowise/FlowiseSimulation';
import { subscribeSimulationSplash } from '@/lib/simulationSplash';

export default function FlowiseSimulationPage() {
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
          <Link
            href="/service/flowise"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--bn-border)] text-[var(--bn-icon)] transition-colors hover:bg-[var(--bn-hover-surface)] hover:text-[var(--bn-icon-hover)]"
            aria-label="Flowise ürün sayfasına dön"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Image
            src="/bn-mark.png"
            alt=""
            width={22}
            height={22}
            className="h-5 w-5 shrink-0 object-contain brightness-0 invert"
          />
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-[var(--bn-heading)]">
              Flowise Simülasyonu
            </p>
            <p className="truncate text-xs text-[var(--bn-subtitle)]">
              RAG pipeline · görsel agent akışı
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setResetKey((key) => key + 1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--bn-border)] bg-[var(--bn-chip-bg)] px-3 py-1.5 text-[12px] font-medium text-[var(--bn-chip-text)] transition hover:border-violet-400/40 hover:text-violet-200"
          >
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
            <span className="hidden sm:inline">Sistemi sıfırla</span>
          </button>
          <span className="hidden rounded-full border border-violet-400/35 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold text-violet-200 md:inline">
            Blacknook · Simülasyon
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden p-3 sm:p-4">
        <FlowiseSimulation key={resetKey} />
      </div>
    </div>
  );
}
