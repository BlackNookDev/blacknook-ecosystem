'use client';

import { animate, m, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

type Props = {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
};

export function PitchAnimatedCounter({
  value,
  duration = 1.4,
  className,
  suffix,
}: Props) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    Math.round(latest).toLocaleString('tr-TR')
  );
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const controls = animate(motionValue, value, { duration, ease: 'easeOut' });
    return () => controls.stop();
  }, [duration, motionValue, started, value]);

  return (
    <m.span
      className={className}
      viewport={{ once: true, amount: 0.5 }}
      onViewportEnter={() => setStarted(true)}
    >
      <m.span>{rounded}</m.span>
      {suffix}
    </m.span>
  );
}
