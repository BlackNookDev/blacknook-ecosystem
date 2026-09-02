'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useReducedMotion } from 'framer-motion';
import SimulationLaunchSplash from '@/components/simulations/SimulationLaunchSplash';
import {
  subscribeSimulationSplash,
  type SplashState,
} from '@/lib/simulationSplash';

const hidden: SplashState = { visible: false, exiting: false, label: 'Simülasyon' };

export default function SimulationSplashHost() {
  const reduce = useReducedMotion();
  const [splash, setSplash] = useState<SplashState>(hidden);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return subscribeSimulationSplash(setSplash);
  }, []);

  if (!mounted || !splash.visible || reduce) return null;

  return createPortal(
    <SimulationLaunchSplash exiting={splash.exiting} label={splash.label} />,
    document.body
  );
}
