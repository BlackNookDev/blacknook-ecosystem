import type { PropsWithChildren, ReactNode } from 'react';
import { PitchSectionBadge } from '@/components/pitch/ui/PitchSectionBadge';
import { cn } from '@/lib/utils';

type Props = PropsWithChildren<{
  id: string;
  badge: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}>;

export function PitchSectionShell({
  id,
  badge,
  title,
  subtitle,
  className,
  children,
}: Props) {
  const a11y = typeof title === 'string' || typeof title === 'number' ? String(title) : badge;

  return (
    <section id={id} className={cn('relative', className)}>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-20 md:px-6 md:py-24">
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <PitchSectionBadge text={badge} />
          <h2 className="sr-only">{a11y}</h2>
          {subtitle ? (
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="mt-10 w-full">{children}</div>
      </div>
    </section>
  );
}
