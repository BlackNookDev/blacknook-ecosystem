'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';
import { Play, type LucideIcon } from 'lucide-react';
import {
  markSimulationLaunch,
  playSimulationLaunchSound,
  SIMULATION_NAVIGATE_DELAY_MS,
} from '@/lib/simulationLaunchSound';
import { withSimulationReturnPath } from '@/lib/simulationPaths';

type Props = {
  href: string;
  returnTo?: string;
  className?: string;
  label?: string;
  splashLabel?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  'aria-label'?: string;
  onLaunch?: () => void;
};

export default function SimulationLaunchButton({
  href,
  returnTo,
  className,
  label = 'Önizleme',
  splashLabel,
  icon: Icon = Play,
  children,
  'aria-label': ariaLabel,
  onLaunch,
}: Props) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [launching, setLaunching] = useState(false);
  const destination = withSimulationReturnPath(href, returnTo);

  useEffect(() => {
    router.prefetch(destination);
  }, [destination, router]);

  const handleLaunch = () => {
    if (launching) return;
    setLaunching(true);
    onLaunch?.();
    markSimulationLaunch(splashLabel ?? label);

    if (!reduce) {
      playSimulationLaunchSound();
    }

    const delay = reduce ? 80 : SIMULATION_NAVIGATE_DELAY_MS;
    window.setTimeout(() => {
      router.push(destination);
      setLaunching(false);
    }, delay);
  };

  return (
    <button
      type="button"
      onClick={handleLaunch}
      disabled={launching}
      className={className}
      aria-busy={launching}
      aria-label={ariaLabel ?? (typeof label === 'string' && label ? label : 'Simülasyonu başlat')}
    >
      {children ?? (
        <>
          <Icon className="h-4 w-4 shrink-0" aria-hidden />
          {label ? <span>{label}</span> : null}
        </>
      )}
    </button>
  );
}
