'use client';

import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSession } from 'next-auth/react';
import { AnimatePresence, m } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import { duration, easePremium } from '@/components/motion/tokens';
import { apiFetch } from '@/lib/apiUrl';

type Props = {
  open: boolean;
  onClose: () => void;
  searchQuery?: string;
};

const SECTORS = [
  'İnşaat',
  'Üretim',
  'Perakende',
  'E-ticaret',
  'Sağlık',
  'Finans',
  'Lojistik',
  'Hizmet',
  'Teknoloji',
  'Diğer',
] as const;

export default function SearchGapFeedbackModal({ open, onClose, searchQuery = '' }: Props) {
  const { data: session } = useSession();
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [need, setNeed] = useState('');
  const [sector, setSector] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const loggedIn = Boolean(session?.user?.email);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setNeed(searchQuery.trim());
    setSector('');
    setCompanyName('');
    setName(session?.user?.name || '');
    setEmail(session?.user?.email || '');
    setError('');
    setDone(false);
    setSending(false);
  }, [open, searchQuery, session?.user?.email, session?.user?.name]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      const res = await apiFetch('/api/search-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          need,
          sector,
          companyName,
          searchQuery,
          name: loggedIn ? undefined : name,
          email: loggedIn ? undefined : email,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || 'Talep gönderilemedi.');
        return;
      }
      setDone(true);
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setSending(false);
    }
  };

  if (!mounted) return null;

  const fieldClass =
    'w-full rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-white/25 focus:ring-2 focus:ring-white/10';
  const labelClass = 'mb-1.5 block text-xs font-medium text-zinc-400';

  return createPortal(
    <AnimatePresence>
      {open ? (
        <m.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast }}
        >
          <button
            type="button"
            aria-label="Kapat"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <m.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: duration.base, ease: easePremium }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/12 bg-[#121214] shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/[0.08] px-5 py-4">
              <div>
                <h2 id={titleId} className="font-display text-base font-semibold text-zinc-50">
                  Talebinizi bildirin
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  Aradığınız çözümü tarif edin; ekibimiz size dönüş yapsın.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-100"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            {done ? (
              <div className="px-5 py-8 text-center">
                <p className="font-display text-lg font-semibold text-zinc-50">Talebiniz alındı</p>
                <p className="mt-2 text-sm text-zinc-400">
                  En kısa sürede e-posta ile dönüş yapacağız.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 transition-opacity hover:opacity-90"
                >
                  Tamam
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4 px-5 py-5">
                <div>
                  <label htmlFor="sgf-need" className={labelClass}>
                    Aradığınız çözümü tarif edin
                  </label>
                  <textarea
                    id="sgf-need"
                    required
                    rows={4}
                    value={need}
                    onChange={(e) => setNeed(e.target.value)}
                    placeholder="Örn. Şantiye masraflarını ERP’ye otomatik fiş olarak aktarmak istiyoruz…"
                    className={`${fieldClass} resize-y min-h-[96px]`}
                  />
                </div>

                <div>
                  <label htmlFor="sgf-sector" className={labelClass}>
                    Sektör
                  </label>
                  <select
                    id="sgf-sector"
                    required
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className={fieldClass}
                  >
                    <option value="" disabled>
                      Seçin
                    </option>
                    {SECTORS.map((s) => (
                      <option key={s} value={s} className="bg-zinc-900">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="sgf-company" className={labelClass}>
                    Şirket
                  </label>
                  <input
                    id="sgf-company"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Şirket adı"
                    className={fieldClass}
                    autoComplete="organization"
                  />
                </div>

                {!loggedIn ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="sgf-name" className={labelClass}>
                        Adınız
                      </label>
                      <input
                        id="sgf-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ad Soyad"
                        className={fieldClass}
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label htmlFor="sgf-email" className={labelClass}>
                        E-posta
                      </label>
                      <input
                        id="sgf-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ornek@sirket.com"
                        className={fieldClass}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                ) : null}

                {error ? <p className="text-sm text-rose-300">{error}</p> : null}

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-zinc-950 transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Gönderiliyor…
                    </>
                  ) : (
                    'Talebi gönder'
                  )}
                </button>
              </form>
            )}
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
