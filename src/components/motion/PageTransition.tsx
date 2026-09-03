'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { duration, easePremium } from '@/components/motion/tokens';
import { isNookAgentLaunchPath } from '@/lib/nookAgent';
import { isSimulationPath } from '@/lib/simulationPaths';

type Props = {
  children: React.ReactNode;
};

/**
 * Sayfa geçişi — yalnızca hafif kaydırma.
 * Opacity animasyonu backdrop-blur / yarı saydam katmanlarda kirli ışık artefaktı üretir.
 */
export default function PageTransition({ children }: Props) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  if (reduce || isSimulationPath(pathname) || isNookAgentLaunchPath(pathname)) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={pathname}
        initial={{ y: 8 }}
        animate={{ y: 0 }}
        transition={{ duration: duration.fast, ease: easePremium }}
        className="min-h-0"
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
