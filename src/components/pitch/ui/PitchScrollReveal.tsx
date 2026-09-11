'use client';

import { m, useReducedMotion } from 'framer-motion';
import type { PropsWithChildren } from 'react';
import { duration, easePremium } from '@/components/motion/tokens';

type Props = PropsWithChildren<{
  className?: string;
  delay?: number;
}>;

export function PitchScrollReveal({ children, className, delay = 0 }: Props) {
  const reduce = useReducedMotion();

  return (
    <m.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: duration.slow, ease: easePremium, delay }}
    >
      {children}
    </m.div>
  );
}
