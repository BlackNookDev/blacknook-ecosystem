'use client';

import { cn } from '@/lib/utils';

export type SimTab<T extends string> = { id: T; label: string };

type Props<T extends string> = {
  tabs: SimTab<T>[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
};

export default function SimTabNav<T extends string>({
  tabs,
  active,
  onChange,
  className,
}: Props<T>) {
  return (
    <nav
      className={cn(
        'flex shrink-0 gap-1 overflow-x-auto border-b px-3 py-2',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition-colors',
            active === tab.id
              ? 'bg-white text-zinc-950'
              : 'text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200'
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
