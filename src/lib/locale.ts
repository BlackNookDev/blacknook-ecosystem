export const LOCALE_STORAGE_KEY = 'bn-locale';
export const LOCALE_CHANGE_EVENT = 'bn-locale-change';

/** English default + Turkish + Spanish, German, French */
export type AppLocale = 'en' | 'tr' | 'es' | 'de' | 'fr';

export const APP_LOCALES: {
  code: AppLocale;
  label: string;
  nativeLabel: string;
}[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'tr', label: 'Turkish', nativeLabel: 'Türkçe' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
];

export const DEFAULT_LOCALE: AppLocale = 'tr';

export function isAppLocale(value: string): value is AppLocale {
  return APP_LOCALES.some((l) => l.code === value);
}

export function getStoredLocale(): AppLocale {
  return DEFAULT_LOCALE;
}

export function setStoredLocale(locale: AppLocale) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
  } catch {
    /* ignore */
  }
}

export function localeMeta(code: AppLocale) {
  return APP_LOCALES.find((l) => l.code === code) ?? APP_LOCALES[0];
}
