'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { AnimatePresence, m } from 'framer-motion';
import { Loader2, Sparkles, X } from 'lucide-react';
import DeveloperAvatars from '@/components/presence/DeveloperAvatars';
import { useMatchPool } from '@/components/presence/useMatchPool';
import { duration, easePremium } from '@/components/motion/tokens';
import { apiFetch } from '@/lib/apiUrl';
import { matchSuccessTitle } from '@/lib/matchDisplay';

type Phase = 'ask' | 'typing' | 'matching' | 'done' | 'error';

type Assigned = {
  name: string;
  skills?: string;
  initials: string;
  color: string;
  role?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

const AI_PROMPT = 'Neye ihtiyacınız var?';

export default function MatchDeveloperModal({ open, onClose }: Props) {
  const { count, people } = useMatchPool();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>('ask');
  const [typed, setTyped] = useState('');
  const [need, setNeed] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [assigned, setAssigned] = useState<Assigned | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setPhase('ask');
      setTyped('');
      setNeed('');
      setSubmitError('');
      setAssigned(null);
      setConversationId(null);
      return;
    }

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let i = 0;
    setTyped('');
    setPhase('typing');
    const timer = window.setInterval(() => {
      i += 1;
      setTyped(AI_PROMPT.slice(0, i));
      if (i >= AI_PROMPT.length) {
        window.clearInterval(timer);
        setPhase('ask');
      }
    }, 38);

    return () => {
      document.body.style.overflow = prev;
      window.clearInterval(timer);
    };
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = need.trim();
    if (!text || phase === 'matching' || phase === 'done') return;

    setSubmitError('');
    setPhase('matching');

    void (async () => {
      try {
        const res = await apiFetch('/api/match-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ need: text }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          conversationId?: number | null;
          assigned?: Assigned | null;
        };
        if (!res.ok) {
          setSubmitError(data.error || 'Talep iletilemedi. Lütfen tekrar deneyin.');
          setPhase('error');
          return;
        }
        setAssigned(data.assigned || null);
        setConversationId(data.conversationId ?? null);
        setPhase('done');
      } catch {
        setSubmitError('Talep iletilemedi. Lütfen tekrar deneyin.');
        setPhase('error');
      }
    })();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-[220] flex flex-col bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast, ease: easePremium }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="match-ai-title"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute left-1/2 top-1/3 h-[50vmin] w-[70vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_65%)] blur-2xl" />
          </div>

          <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-8">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Sparkles className="h-4 w-4 text-zinc-200" aria-hidden />
              Blacknook Match
              <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                {count > 0 ? `${count} açık` : 'Ekip'}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8">
            <div className="w-full max-w-xl">
              <p id="match-ai-title" className="sr-only">
                Geliştirici eşleştirme
              </p>

              <div className="mb-8 min-h-[2.5rem]">
                <p className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {typed}
                  {phase === 'typing' && (
                    <span className="ml-0.5 inline-block h-6 w-0.5 animate-pulse bg-white align-middle" />
                  )}
                </p>
              </div>

              {phase !== 'matching' && phase !== 'done' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <textarea
                    value={need}
                    onChange={(e) => setNeed(e.target.value)}
                    rows={4}
                    placeholder="Örn. Self-host kurulum ve faturalama entegrasyonuna ihtiyacım var…"
                    disabled={phase === 'typing'}
                    className="w-full resize-none rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={phase === 'typing' || !need.trim()}
                    className="h-12 w-full rounded-xl bg-white text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Eşleş
                  </button>
                </form>
              )}

              {(phase === 'matching' || phase === 'done' || phase === 'error') && (
                <m.div
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: duration.base, ease: easePremium }}
                >
                  {phase === 'matching' ? (
                    <>
                      <div className="flex justify-center">
                        <DeveloperAvatars people={people} count={Math.min(6, people.length)} size="md" />
                      </div>
                      <Loader2 className="mx-auto mt-5 h-5 w-5 animate-spin text-zinc-400" aria-hidden />
                      <p className="mt-4 font-display text-lg font-semibold text-white">
                        Uygun kişi aranıyor…
                      </p>
                      <p className="mt-2 text-sm text-zinc-500">
                        {count > 0
                          ? `${count} açık profilden atama yapılıyor`
                          : 'Ekibe iletiliyor'}
                      </p>
                    </>
                  ) : phase === 'done' ? (
                    <>
                      <div className="mb-4 flex justify-center">
                        {assigned ? (
                          <DeveloperAvatars
                            people={[
                              {
                                id: 'assigned',
                                initials: assigned.initials,
                                color: assigned.color,
                                role: assigned.skills || assigned.role,
                              },
                            ]}
                            size="md"
                          />
                        ) : (
                          <DeveloperAvatars people={people.slice(0, 1)} size="md" />
                        )}
                      </div>
                      <p className="font-display text-lg font-semibold text-white">
                        {assigned ? matchSuccessTitle(assigned.name) : 'Talebiniz ekibe iletildi'}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                        {assigned
                          ? 'Sohbete siteden devam edin. Karşı taraf bildirim ve e-posta alır.'
                          : 'Şu an açık geliştirici yok. Ekip talebinizi alacak ve dönüş yapacak.'}
                      </p>
                      {conversationId ? (
                        <Link
                          href={`/account/messages?c=${conversationId}`}
                          onClick={onClose}
                          className="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-6 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                        >
                          Mesaja git
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={onClose}
                          className="mt-6 h-11 rounded-xl border border-white/15 px-6 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/5"
                        >
                          Kapat
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="font-display text-lg font-semibold text-white">
                        Talep iletilemedi
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                        {submitError || 'Lütfen biraz sonra tekrar deneyin.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitError('');
                          setPhase('ask');
                        }}
                        className="mt-6 h-11 rounded-xl bg-white px-6 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                      >
                        Tekrar dene
                      </button>
                    </>
                  )}
                </m.div>
              )}
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
