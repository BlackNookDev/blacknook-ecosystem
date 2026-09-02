'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Globe } from 'lucide-react';
import { useLocale } from '@/components/LocaleProvider';
import { localeMeta, type AppLocale } from '@/lib/locale';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  menuAlign?: 'left' | 'right';
};

export default function LocaleSelector({ className, menuAlign = 'right' }: Props) {
  const { locale, setLocale, locales, mounted, t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const select = (code: AppLocale) => {
    setLocale(code);
    setOpen(false);
  };

  const current = localeMeta(locale);
  const label = t('nav.language');

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(className)}
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        title={current.nativeLabel}
      >
        <Globe className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
        <span className="text-[10px] font-bold uppercase tracking-wide">
          {mounted ? locale : 'en'}
        </span>
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={label}
          className={cn(
            'absolute top-[calc(100%+0.5rem)] z-[80] min-w-[10.5rem] overflow-hidden rounded-xl border border-white/10 bg-zinc-900/95 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl',
            menuAlign === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {locales.map((item) => {
            const active = locale === item.code;
            return (
              <li key={item.code} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => select(item.code)}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    active
                      ? 'bg-teal-500/15 text-teal-100'
                      : 'text-zinc-200 hover:bg-white/[0.06]'
                  )}
                >
                  <span>
                    <span className="block font-medium">{item.nativeLabel}</span>
                    <span className="text-[10px] uppercase tracking-wide text-zinc-500">
                      {item.code}
                    </span>
                  </span>
                  {active ? <Check className="h-4 w-4 shrink-0 text-teal-300" aria-hidden /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
