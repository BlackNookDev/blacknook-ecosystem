import type { AppLocale } from '@/lib/locale';
import en from '@/messages/en';
import tr from '@/messages/tr';
import es from '@/messages/es';
import de from '@/messages/de';
import fr from '@/messages/fr';

export type MessageTree = { [key: string]: string | MessageTree };

export type Messages = MessageTree;

const CATALOGS: Record<AppLocale, Messages> = {
  en: en as Messages,
  tr: tr as Messages,
  es: es as Messages,
  de: de as Messages,
  fr: fr as Messages,
};

export type TranslateParams = Record<string, string | number>;

function getNested(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function interpolate(template: string, params?: TranslateParams) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(params[key] ?? `{${key}}`));
}

export function createTranslator(locale: AppLocale) {
  const messages = CATALOGS[locale] ?? CATALOGS.tr;
  const fallback = CATALOGS.tr;

  return function t(key: string, params?: TranslateParams & { defaultValue?: string }): string {
    const { defaultValue, ...rest } = params ?? {};
    let value = getNested(messages, key);
    if (typeof value !== 'string') {
      value = getNested(fallback, key);
    }
    if (typeof value !== 'string') {
      return defaultValue ?? key;
    }
    return interpolate(value, rest);
  };
}

export type TranslateFn = ReturnType<typeof createTranslator>;
