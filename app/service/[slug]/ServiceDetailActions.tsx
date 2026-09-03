'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { apiFetch } from '@/lib/apiUrl';
import { AnimatePresence, m } from 'framer-motion';
import { Play, Send, X } from 'lucide-react';
import SimulationLaunchButton from '@/components/simulations/SimulationLaunchButton';
import { duration, easePremium } from '@/components/motion/tokens';
import { getServiceSimulationPath } from '@/lib/simulationPaths';

type Props = {
  serviceName: string;
  serviceSlug: string;
  demoUrl?: string;
};

export default function ServiceDetailActions({ serviceName, serviceSlug, demoUrl }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [requirements, setRequirements] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchParams.get('openInstall') !== '1') return;
    setOpen(true);
    router.replace(pathname, { scroll: false });
  }, [searchParams, pathname, router]);

  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const resetForm = () => {
    setRequirements('');
    setCompanyName('');
    setEmail(session?.user?.email ?? '');
    setError('');
    setSuccess(false);
  };

  const closeModal = () => {
    setOpen(false);
    setTimeout(resetForm, 200);
  };

  const handleRequestClick = () => {
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      const res = await apiFetch('/api/installation-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceSlug,
          serviceName,
          requirements,
          companyName,
          email,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Talep gönderilemedi.');
        return;
      }
      setSuccess(true);
      setTimeout(() => closeModal(), 1800);
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setSending(false);
    }
  };

  const modal = (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast, ease: easePremium }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-request-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Kapat"
            onClick={closeModal}
          />

          <m.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: duration.base, ease: easePremium }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[var(--bn-surface,#0c0c0e)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/80 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>

            <form onSubmit={handleSubmit} className="relative p-8 pt-10">
              <h2 id="install-request-title" className="pr-10 text-xl font-bold text-white">
                Kurulum talep et
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                <span className="font-medium text-zinc-300">{serviceName}</span> için kurulum
                ihtiyacınızı yazın; en kısa sürede{' '}
                <span className="text-zinc-300">contact@blacknook.com</span> üzerinden size dönüş
                yapacağız.
              </p>

              {success ? (
                <p className="mt-8 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-zinc-200">
                  Talebiniz kaydedildi. Hesap → Talepler’den takip edebilirsiniz.
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="install-requirements" className="sr-only">
                      Kurulum talebi detayı
                    </label>
                    <textarea
                      id="install-requirements"
                      required
                      rows={4}
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder={`${serviceName} kurulumu için gereksinimlerinizi yazın…`}
                      className="w-full resize-none rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/15"
                    />
                  </div>
                  <div>
                    <label htmlFor="install-company" className="sr-only">
                      Şirket adı
                    </label>
                    <input
                      id="install-company"
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Şirket adı"
                      className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/15"
                    />
                  </div>
                  <div>
                    <label htmlFor="install-email" className="sr-only">
                      E-posta
                    </label>
                    <input
                      id="install-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-posta"
                      className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/15"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-400" role="alert">
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={closeModal}
                      disabled={sending}
                      className="flex-1 rounded-xl border border-white/10 bg-zinc-900/50 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:bg-zinc-800/80 disabled:opacity-50"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={sending}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-black py-3 text-sm font-semibold text-white transition-all hover:border-white/25 hover:bg-zinc-950 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" aria-hidden />
                      {sending ? 'Gönderiliyor…' : 'Talebi gönder'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );

  const simulationHref = demoUrl ?? getServiceSimulationPath(serviceSlug);

  return (
    <>
      {simulationHref ? (
        simulationHref.startsWith('/') ? (
          <SimulationLaunchButton
            href={simulationHref}
            returnTo={pathname}
            splashLabel={`${serviceName} Simülasyonu`}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-full border border-teal-400/40 bg-teal-500/15 py-3.5 text-sm font-semibold text-teal-50 transition-[border-color,background-color,opacity] duration-premium ease-premium hover:border-teal-300/55 hover:bg-teal-500/20 disabled:opacity-80"
          />
        ) : (
          <a
            href={simulationHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-full border border-teal-400/40 bg-teal-500/15 py-3.5 text-sm font-semibold text-teal-50 transition-[border-color,background-color] duration-premium ease-premium hover:border-teal-300/55 hover:bg-teal-500/20"
          >
            <Play className="h-4 w-4 shrink-0" aria-hidden />
            Simülasyon
          </a>
        )
      ) : null}
      <m.button
        type="button"
        whileTap={{ scale: 0.98 }}
        className="group relative w-full rounded-full bg-white py-3.5 text-sm font-semibold text-black transition-[opacity,transform] duration-premium ease-premium hover:opacity-90"
        onClick={handleRequestClick}
      >
        Kurulum talep et
      </m.button>
      {mounted && createPortal(modal, document.body)}
    </>
  );
}
