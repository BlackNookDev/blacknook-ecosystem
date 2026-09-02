'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { applyTheme, type ThemeMode } from '@/lib/theme';

type ThemeContextValue = {
  theme: ThemeMode;
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    applyTheme('dark');
    setMounted(true);
  }, []);

  const value = useMemo(
    () => ({
      theme: 'dark' as const,
      mounted,
    }),
    [mounted]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
