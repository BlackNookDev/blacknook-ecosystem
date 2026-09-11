'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Loader2, Lock } from 'lucide-react';
import { PitchTechBackground } from '@/components/pitch/ui/PitchTechBackground';
import {
  markSimulationLaunch,
  playSimulationLaunchSound,
  SIMULATION_NAVIGATE_DELAY_MS,
} from '@/lib/simulationLaunchSound';

export default function PitchUnlockForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();
  const nextPath = searchParams.get('next') || '/pitch';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/pitch/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setError(data.error || 'Şifre doğrulanamadı.');
        setIsLoading(false);
        return;
      }

      const target =
        nextPath.startsWith('/pitch') && !nextPath.startsWith('//')
          ? nextPath
          : '/pitch';

      markSimulationLaunch('Pitch');
      if (!reduce) {
        playSimulationLaunchSound();
      }

      const delay = reduce ? 80 : SIMULATION_NAVIGATE_DELAY_MS;
      window.setTimeout(() => {
        router.replace(target);
        router.refresh();
      }, delay);
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-transparent px-6">
      <PitchTechBackground />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-200">
            <Lock className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Blacknook
            </p>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-white">
              Pitch erişimi
            </h1>
          </div>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-zinc-400">
          Bu sayfa herkese açık değildir. Devam etmek için şifreyi girin.
        </p>

        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
          {error ? (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="current-password"
            aria-label="Pitch şifresi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            placeholder="Şifre"
            className="h-12 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-black transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                Doğrulanıyor…
              </>
            ) : (
              'Giriş'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
