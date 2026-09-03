'use client';

import { cn } from '@/lib/utils';
import type { SubheadingOption } from '../../../lib/catalogSubheadings';

type Props = {
  options: SubheadingOption[];
  activeId: string | null;
  onChange: (id: string | null) => void;
  className?: string;
};

export default function SubheadingFilterChips({ options, activeId, onChange, className }: Props) {
  if (options.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
          !activeId
            ? 'border-sky-400/40 bg-sky-500/15 text-sky-100'
            : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-zinc-200'
        )}
      >
        Tümü
      </button>
      {options.map((option) => {
        const active = activeId === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(active ? null : option.id)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              active
                ? 'border-sky-400/40 bg-sky-500/15 text-sky-100'
                : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:text-zinc-200'
            )}
          >
            {option.label}
            <span className={cn('tabular-nums', active ? 'text-sky-300/80' : 'text-zinc-600')}>
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
