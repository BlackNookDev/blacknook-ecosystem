'use client';

import { cn } from '@/lib/utils';

type Gender = 'male' | 'female';

type Props = {
  name: string;
  gender: Gender;
  accent: string;
  className?: string;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

/** Sade cam (glass) avatar — cinsiyet silueti + baş harfler. */
export function PitchTeamAvatar({ name, gender, accent, className }: Props) {
  return (
    <div
      className={cn('relative h-full w-full overflow-hidden', className)}
      role="img"
      aria-label={`${name} avatar`}
      style={{ ['--av' as string]: accent }}
    >
      {/* Soft wash */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(120% 90% at 20% 0%, color-mix(in srgb, var(--av) 28%, transparent) 0%, transparent 55%),
            radial-gradient(90% 80% at 100% 100%, color-mix(in srgb, var(--av) 16%, transparent) 0%, transparent 50%),
            linear-gradient(160deg, #1a1a1e 0%, #0c0c0e 100%)
          `,
        }}
      />

      {/* Glass plate */}
      <div
        aria-hidden
        className="absolute inset-[12%] rounded-[1.35rem] border border-white/20 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-md"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[12%] rounded-[1.35rem]"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 38%, transparent 55%)',
        }}
      />

      {/* Content */}
      <div className="relative flex h-full flex-col items-center justify-center gap-3.5 px-4 sm:gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] sm:h-[4.5rem] sm:w-[4.5rem]"
          style={{
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.28), 0 0 0 1px color-mix(in srgb, var(--av) 35%, transparent)`,
          }}
        >
          {gender === 'female' ? <FemaleIcon /> : <MaleIcon />}
        </div>
        <span
          className="font-display text-[1.75rem] font-semibold tracking-tight text-white/90 sm:text-3xl"
          style={{ textShadow: '0 1px 12px color-mix(in srgb, var(--av) 40%, transparent)' }}
        >
          {initials(name)}
        </span>
      </div>
    </div>
  );
}

function MaleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 text-white/85 sm:h-9 sm:w-9" aria-hidden fill="none">
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.5 19.5c.8-3.4 2.9-5 5.5-5s4.7 1.6 5.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FemaleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 text-white/85 sm:h-9 sm:w-9" aria-hidden fill="none">
      {/* Soft hair volume */}
      <path
        d="M8.2 9.2c0-3.1 1.7-5.1 3.8-5.1s3.8 2 3.8 5.1c0 1.4-.3 2.6-.7 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="12" cy="8.2" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 19.5c.7-3.2 2.7-4.7 5-4.7s4.3 1.5 5 4.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
