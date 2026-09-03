'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { sanitizeSimulationReturnPath } from '@/lib/simulationPaths';

type Props = {
  fallback?: string;
  'aria-label': string;
};

export default function SimulationBackLink({ fallback, 'aria-label': ariaLabel }: Props) {
  const searchParams = useSearchParams();
  const href = sanitizeSimulationReturnPath(searchParams.get('return'), fallback);

  return (
    <Link
      href={href}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--bn-border)] text-[var(--bn-icon)] transition-colors hover:bg-[var(--bn-hover-surface)] hover:text-[var(--bn-icon-hover)]"
      aria-label={ariaLabel}
    >
      <ArrowLeft className="h-4 w-4" />
    </Link>
  );
}
