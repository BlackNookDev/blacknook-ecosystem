'use client';

import { useState } from 'react';
import { Check, Loader2, Shield, Sparkles } from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import HeroPresenceStrip from '@/components/presence/HeroPresenceStrip';
import { duration, easePremium } from '@/components/motion/tokens';
import { getHeroAgents } from '../../../lib/data';
import { apiFetch } from '@/lib/apiUrl';

const FLOATING = getHeroAgents().map((s, i) => ({
  ...s,
  style: [
    { top: '10%', left: '8%', rotate: -12, size: 'lg' as const },
    { top: '14%', right: '10%', rotate: 10, size: 'md' as const },
    { top: '40%', left: '5%', rotate: 8, size: 'md' as const },
    { top: '44%', right: '6%', rotate: -8, size: 'lg' as const },
    { bottom: '20%', left: '12%', rotate: -6, size: 'md' as const },
    { bottom: '16%', right: '11%', rotate: 14, size: 'md' as const },
    { top: '56%', left: '20%', rotate: 4, size: 'sm' as const },
    { top: '60%', right: '18%', rotate: -4, size: 'sm' as const },
  ][i],
  delay: i * 0.35,
}));

const TRUST = [
  { icon: Sparkles, label: '60 gün para iadesi garantisi' },
  { icon: Shield, label: 'Doğrulanmış sağlayıcılar' },
  { icon: Check, label: '100+ MCP ajanı tek ekosistemde' },
];

export default function HeroMailCollector() {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading' || !email.trim()) return;
    setError('');
    setStatus('loading');

    try {
      const res = await apiFetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || 'Kayıt alınamadı. Lütfen tekrar deneyin.');
        setStatus('idle');
        return;
      }
      setStatus('done');
      setEmail('');
      window.setTimeout(() => setStatus('idle'), 3500);
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
      setStatus('idle');
    }
  };

  return (
    <section className="relative flex min-h-[72svh] w-full flex-col items-center justify-center overflow-hidden px-4 pb-10 pt-24 sm:min-h-[68svh]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-[30%] h-[40vmin] w-[52vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_68%)] blur-2xl" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--bn-bg,#050505)] to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
        {FLOATING.map((item) => (
          <m.div
            key={item.slug}
            className="absolute"
            style={{
              top: item.style.top,
              left: item.style.left,
              right: item.style.right,
              bottom: item.style.bottom,
              rotate: `${item.style.rotate}deg`,
            }}
            animate={
              reduce
                ? undefined
                : {
                    y: [0, -8, 0],
                    rotate: [
                      item.style.rotate,
                      item.style.rotate + 3,
                      item.style.rotate,
                    ],
                  }
            }
            transition={{
              duration: 5 + item.delay,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
            }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] shadow-[0_8px_28px_rgba(0,0,0,0.4)] backdrop-blur-md lg:h-11 lg:w-11">
              <ServiceCatalogLogo
                icon={item.icon}
                brandColor={item.brandColor}
                name={item.name}
                size="sm"
              />
            </div>
          </m.div>
        ))}
      </div>

      <m.div
        className="relative z-10 w-full max-w-sm"
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.scene, ease: easePremium }}
      >
        <div className="relative rounded-2xl border border-white/10 bg-zinc-950/80 p-5 shadow-[0_16px_56px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-6">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-zinc-900 shadow-lg">
              <img
                src="/bn-mark.png"
                alt="Blacknook"
                width={22}
                height={22}
                className="h-5 w-5 object-contain brightness-0 invert"
              />
            </div>
          </div>

          <div className="mt-2 text-center">
            <h1 className="font-display text-xl font-bold leading-tight tracking-tight text-white sm:text-[1.35rem]">
              Bağımsız yazılım.
              <span className="mt-0.5 block text-zinc-400">Tek seferlik lisans.</span>
            </h1>
            <p className="mt-2.5 text-xs text-zinc-500 sm:text-sm">
              Erken erişim ve lansman güncellemelerini alın
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-2.5">
            {error ? (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </p>
            ) : null}
            <label htmlFor="hero-email" className="sr-only">
              E-posta
            </label>
            <input
              id="hero-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading' || status === 'done'}
              placeholder="E-posta"
              className="h-9 w-full rounded-lg border border-white/15 bg-white/[0.04] px-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'done'}
              className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-white text-xs font-bold text-black transition-[opacity,transform] duration-premium ease-premium hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:text-sm"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  Kaydediliyor…
                </>
              ) : status === 'done' ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden />
                  Listeye eklendiniz
                </>
              ) : (
                'Erken Erişim Bildirimi Al'
              )}
            </button>
          </form>
        </div>
      </m.div>

      <m.ul
        className="relative z-10 mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: duration.base, ease: easePremium }}
      >
        {TRUST.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Icon className="h-3.5 w-3.5 text-zinc-300" strokeWidth={1.75} aria-hidden />
            {label}
          </li>
        ))}
      </m.ul>

      <HeroPresenceStrip />
    </section>
  );
}
