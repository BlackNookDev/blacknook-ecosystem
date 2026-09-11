import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

type Glow = 'teal' | 'white' | 'amber' | 'violet' | 'sky';

const GLOW: Record<Glow, string> = {
  teal: 'rgba(20,184,166,0.14)',
  white: 'rgba(255,255,255,0.08)',
  amber: 'rgba(245,158,11,0.14)',
  violet: 'rgba(56,189,248,0.22)',
  sky: 'rgba(56,189,248,0.18)',
};

type Props = PropsWithChildren<{
  className?: string;
  color?: Glow;
  /** İç padding kapat (tablolar için) */
  flush?: boolean;
}>;

export function PitchGlowCard({
  children,
  className,
  color = 'teal',
  flush = false,
}: Props) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--bn-card-bg)] backdrop-blur-sm',
        'shadow-[var(--bn-card-shadow)]',
        'transition-transform duration-200 hover:scale-[1.015]',
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-24 opacity-80 blur-2xl"
        style={{
          background: `radial-gradient(55% 55% at 18% 18%, ${GLOW[color]} 0%, transparent 62%)`,
        }}
      />
      <div className={cn('relative', flush ? 'p-2 sm:p-4' : 'p-5 sm:p-6')}>
        {children}
      </div>
    </div>
  );
}
