'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { RefreshCw } from 'lucide-react';
import SimulationBackLink from '@/components/simulations/SimulationBackLink';
import { subscribeSimulationSplash } from '@/lib/simulationSplash';

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  resetKey?: number;
  onReset?: () => void;
  fallbackReturn?: string;
};

export default function SimulationPageLayout({
  title,
  subtitle,
  children,
  resetKey,
  onReset,
  fallbackReturn = '/agent',
}: Props) {
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
          <SimulationBackLink fallback={fallbackReturn} aria-label="Panele dön" />
          <Image
            src="/bn-mark.png"
            alt=""
            width={22}
            height={22}
            className="h-5 w-5 shrink-0 object-contain brightness-0 invert"
          />
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-[var(--bn-heading)]">
              {title}
            </p>
            {subtitle ? (
              <p className="truncate text-xs text-[var(--bn-subtitle)]">{subtitle}</p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {onReset ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--bn-border)] bg-[var(--bn-chip-bg)] px-3 py-1.5 text-[12px] font-medium text-[var(--bn-chip-text)] transition hover:border-white/25 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
              <span className="hidden sm:inline">Sistemi sıfırla</span>
            </button>
          ) : null}
          <span className="hidden rounded-full border border-white/20 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold text-zinc-200 md:inline">
            Blacknook · Önizleme
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden p-3 sm:p-4" key={resetKey}>
        {children}
      </div>
    </div>
  );
}
