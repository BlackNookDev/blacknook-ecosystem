'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

const CAL_EMBED =
  process.env.NEXT_PUBLIC_BN_SETUP_CAL_URL ||
  'https://cal.com/blacknook/kurulum';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SetupBookingModal({ open, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Kapat"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="setup-booking-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 id="setup-booking-title" className="font-display text-lg font-semibold text-white">
              Canlı kurulum randevusu
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Blacknook mühendisleriyle 15 dakikalık canlı devreye alma.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:bg-white/[0.06] hover:text-white"
            aria-label="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-[420px] flex-1 bg-zinc-900/80 p-2 sm:p-4">
          <iframe
            title="Kurulum randevusu"
            src={CAL_EMBED}
            className="h-[420px] w-full rounded-xl border border-white/10 bg-white"
          />
        </div>
        <div className="border-t border-white/10 px-5 py-3 text-center text-xs text-zinc-500">
          Randevu penceresi açılmazsa{' '}
          <a
            href={CAL_EMBED}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-300 underline-offset-2 hover:underline"
          >
            yeni sekmede açın
          </a>
          .
        </div>
      </div>
    </div>,
    document.body
  );
}
