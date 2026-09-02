export type ThemeMode = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'bn-theme';

/** Curtain wipe colors — matches --bn-bg in globals.css */
export const THEME_SURFACE: Record<ThemeMode, string> = {
  dark: '#161618',
  light: '#f4f4f5',
};

export const THEME_TRANSITION_MS = 780;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
}

export function storeTheme(theme: ThemeMode) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}
