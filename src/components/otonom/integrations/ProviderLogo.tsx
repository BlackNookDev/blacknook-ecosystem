'use client';

import { useState } from 'react';
import type { IntegrationProvider } from '@/lib/companyIntegrations';
import { getCorporateApp } from '@/lib/companyIntegrations';
import { cn } from '@/lib/utils';

export function ProviderLogo({
  provider,
  className = 'h-7 w-7',
}: {
  provider: IntegrationProvider;
  className?: string;
}) {
  const app = getCorporateApp(provider);
  const [failed, setFailed] = useState(false);

  if (provider === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path
          fill="#25D366"
          d="M12 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.3-1.4A9.9 9.9 0 1 0 12 2zm5.8 14.1c-.2.7-1.3 1.2-1.8 1.3-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-3.9-4.7-4.1-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.2.3-.3.5-.2.2-.3.3-.1.6.2.3.9 1.5 1.9 2.4 1.3 1.2 2.4 1.6 2.7 1.7.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.7-.1.3.1 1.8.8 2.1 1 .3.1.5.2.6.3.1.2.1.9-.1 1.6z"
        />
      </svg>
    );
  }

  if (provider === 'custom_it') {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-md bg-amber-500/15 text-[10px] font-bold text-amber-200',
          className
        )}
        aria-hidden
      >
        IT
      </span>
    );
  }

  if (app && !failed && app.icon.length > 1) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://cdn.simpleicons.org/${app.icon}/${app.brandColor}`}
        alt=""
        className={cn('object-contain', className)}
        onError={() => setFailed(true)}
      />
    );
  }

  const letter = (app?.name || provider).charAt(0).toUpperCase();
  const color = app?.brandColor ? `#${app.brandColor}` : '#a1a1aa';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-md text-xs font-bold',
        className
      )}
      style={{ backgroundColor: `${color}22`, color }}
      aria-hidden
    >
      {letter}
    </span>
  );
}
