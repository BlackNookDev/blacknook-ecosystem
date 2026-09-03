'use client';

import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import MotionProvider from '@/components/motion/MotionProvider';
import SessionSync from '@/components/auth/SessionSync';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LocaleProvider } from '@/components/LocaleProvider';
import SimulationSplashHost from '@/components/simulations/SimulationSplashHost';
import SupportChrome from '@/components/presence/SupportChrome';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <LocaleProvider>
          <SessionSync />
          <MotionProvider>
            <SimulationSplashHost />
            <Suspense fallback={null}>
              <SupportChrome />
            </Suspense>
            {children}
          </MotionProvider>
        </LocaleProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
