'use client';

import Image from 'next/image';
import { m, useReducedMotion } from 'framer-motion';
import { easePremium } from '@/components/motion/tokens';
import './simulation-splash.css';

type Props = {
  exiting?: boolean;
  className?: string;
  label?: string;
};

export default function SimulationLaunchSplash({
  exiting = false,
  className = '',
  label = 'Simülasyon',
}: Props) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[320] overflow-hidden bg-[var(--bn-bg,#161618)] ${className}`}
      aria-hidden
    >
      <m.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-4"
        initial={{ opacity: 1 }}
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: exiting ? 0.5 : 0.2, ease: easePremium }}
      >
        <div
          className={
            exiting
              ? 'flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/10 bg-[var(--bn-surface,#1c1c1f)] sm:h-28 sm:w-28'
              : 'splash-logo-blink flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/10 bg-[var(--bn-surface,#1c1c1f)] sm:h-28 sm:w-28'
          }
        >
          <Image
            src="/bn-mark.png"
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 object-contain brightness-0 invert sm:h-16 sm:w-16"
            priority
          />
        </div>

        <p
          className={
            exiting
              ? 'text-[11px] font-semibold tracking-[0.22em] text-[var(--bn-muted)] uppercase'
              : 'splash-label-blink text-[11px] font-semibold tracking-[0.22em] text-[var(--bn-muted)] uppercase'
          }
        >
          {label}
        </p>
      </m.div>
    </div>
  );
}
