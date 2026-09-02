'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';
import { Play } from 'lucide-react';
import {
  markSimulationLaunch,
  playSimulationLaunchSound,
  SIMULATION_NAVIGATE_DELAY_MS,
} from '@/lib/simulationLaunchSound';

type Props = {
  href: string;
  className?: string;
  label?: string;
  splashLabel?: string;
};

export default function SimulationLaunchButton({
  href,
  className,
  label = 'Simülasyon',
  splashLabel,
}: Props) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    router.prefetch(href);
  }, [href, router]);

  const handleLaunch = () => {
    if (launching) return;
    setLaunching(true);
    markSimulationLaunch(splashLabel ?? label);

    if (!reduce) {
      playSimulationLaunchSound();
    }

    const delay = reduce ? 80 : SIMULATION_NAVIGATE_DELAY_MS;
    window.setTimeout(() => {
      router.push(href);
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
    >
      <Play className="h-4 w-4 shrink-0" aria-hidden />
      {label}
    </button>
  );
}
