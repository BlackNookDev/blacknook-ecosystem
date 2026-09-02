'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createTranslator, type TranslateFn } from '@/lib/i18n';
import {
  APP_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_CHANGE_EVENT,
  getStoredLocale,
  setStoredLocale,
  type AppLocale,
} from '@/lib/locale';

type LocaleContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  locales: typeof APP_LOCALES;
  mounted: boolean;
  t: TranslateFn;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(getStoredLocale());
    setMounted(true);

    const onChange = () => setLocaleState(getStoredLocale());
    window.addEventListener(LOCALE_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(LOCALE_CHANGE_EVENT, onChange);
  }, []);

  const setLocale = useCallback((next: AppLocale) => {
    setStoredLocale(next);
    setLocaleState(next);
  }, []);

  const t = useMemo(() => createTranslator(locale), [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      locales: APP_LOCALES,
      mounted,
      t,
    }),
    [locale, setLocale, mounted, t]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return ctx;
}

export function useTranslations(namespace?: string) {
  const { t, locale } = useLocale();

  return useMemo(() => {
    const scoped = (key: string, params?: Parameters<TranslateFn>[1]) => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      return t(fullKey, params);
    };
    return { t: scoped, locale };
  }, [t, locale, namespace]);
}
