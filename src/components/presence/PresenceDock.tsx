'use client';

import DeveloperAvatars from '@/components/presence/DeveloperAvatars';
import { useMatchPool } from '@/components/presence/useMatchPool';
import { useTranslations } from '@/components/LocaleProvider';

export default function PresenceDock() {
  const { t } = useTranslations('support');
  const { people } = useMatchPool();

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('bn-open-match'))}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 py-1.5 pl-1.5 pr-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-[border-color,transform] hover:scale-[1.02] hover:border-emerald-400/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400/50 active:scale-[0.98]"
      aria-label={t('dock')}
    >
      <DeveloperAvatars people={people} count={3} size="sm" />
      <span className="flex items-center gap-1 text-[11px] font-semibold text-zinc-200">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
        {t('dock')}
      </span>
    </button>
  );
}
