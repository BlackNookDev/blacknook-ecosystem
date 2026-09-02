'use client';

import { Shield } from 'lucide-react';
import { useTranslations } from '@/components/LocaleProvider';

export default function PresenceDock() {
  const { t } = useTranslations('support');

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('bn-open-support'))}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 flex items-center gap-2.5 rounded-full border border-[var(--bn-card-border)] bg-[var(--bn-elevated)]/90 py-2 pl-3 pr-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-[border-color,transform] hover:scale-[1.02] hover:border-teal-400/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400/50 active:scale-[0.98]"
      aria-label={t('dock')}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/15 text-teal-300 ring-1 ring-teal-400/20">
        <Shield className="h-4 w-4" aria-hidden />
      </span>
      <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--bn-heading)]">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-400" />
        {t('dock')}
      </span>
    </button>
  );
}
