'use client';

import { useState } from 'react';
import { Check, Languages } from 'lucide-react';
import AccountSection from '@/components/account/AccountSection';
import { useLocale, useTranslations } from '@/components/LocaleProvider';
import { cn } from '@/lib/utils';

export default function LanguagePreference() {
  const { locale, setLocale, locales } = useLocale();
  const { t } = useTranslations('account');
  const [flash, setFlash] = useState('');

  const select = (code: typeof locale) => {
    setLocale(code);
    setFlash(code === 'tr' ? t('languageSavedTr') : t('languageSaved'));
    window.setTimeout(() => setFlash(''), 2800);
  };

  return (
    <AccountSection title={t('languageTitle')} description={t('languageDescription')}>
      <div className="mb-3 inline-flex items-center gap-2 text-xs text-zinc-500">
        <Languages className="h-3.5 w-3.5" aria-hidden />
        {t('savedOnDevice')}
      </div>
      <div
        className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
        role="radiogroup"
        aria-label={t('languageTitle')}
      >
        {locales.map((item) => {
          const active = locale === item.code;
          return (
            <button
              key={item.code}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => select(item.code)}
              className={cn(
                'flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
                active
                  ? 'border-emerald-400/35 bg-emerald-500/[0.1] text-emerald-100'
                  : 'border-white/[0.08] bg-white/[0.02] text-zinc-300 hover:border-white/15 hover:bg-white/[0.04]'
              )}
            >
              <span>
                <span className="block text-sm font-semibold">{item.nativeLabel}</span>
                <span className="mt-0.5 block text-[11px] uppercase tracking-wide text-zinc-500">
                  {item.code}
                </span>
              </span>
              {active ? (
                <Check className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden />
              ) : null}
            </button>
          );
        })}
      </div>
      {flash ? <p className="mt-3 text-xs text-emerald-400">{flash}</p> : null}
    </AccountSection>
  );
}
