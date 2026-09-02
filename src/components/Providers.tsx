'use client';

import type { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import MotionProvider from '@/components/motion/MotionProvider';
import SessionSync from '@/components/auth/SessionSync';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LocaleProvider } from '@/components/LocaleProvider';
import SimulationSplashHost from '@/components/simulations/SimulationSplashHost';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <LocaleProvider>
          <SessionSync />
          <MotionProvider>
            <SimulationSplashHost />
            {children}
          </MotionProvider>
        </LocaleProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
