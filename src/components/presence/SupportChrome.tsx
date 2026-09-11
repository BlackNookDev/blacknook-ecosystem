'use client';

import SupportRequestModal from '@/components/SupportRequestModal';
import { useTranslations } from '@/components/LocaleProvider';
import { isSimulationPath } from '@/lib/simulationPaths';
import { MessageCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { duration, easePremium } from '@/components/motion/tokens';

/** Giriş sonrası yüzen Destek balonu + sohbet modalı */
export default function SupportChrome() {
  const { data: session, status } = useSession();
  const { t: ts } = useTranslations('support');
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();

  const loggedIn = Boolean(session?.user);
  const hideFab = isSimulationPath(pathname) || open;
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!loggedIn) return;
    if (searchParams.get('destek') === '1') {
      setOpen(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete('destek');
      params.delete('match');
      const q = params.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    }
  }, [searchParams, pathname, router, loggedIn]);

  useEffect(() => {
    if (!loggedIn) return;
    const onOpen = () => setOpen(true);
    window.addEventListener('bn-open-support', onOpen);
    return () => window.removeEventListener('bn-open-support', onOpen);
  }, [loggedIn]);

  return (
    <>
      <AnimatePresence>
        {status !== 'loading' && loggedIn && !hideFab ? (
          <m.button
            type="button"
            key="support-fab"
            initial={reduce ? false : { opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ duration: duration.base, ease: easePremium }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 right-5 z-[180] inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-900/90 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors hover:border-teal-400/40 hover:bg-zinc-800/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400/50 sm:bottom-6 sm:right-6"
            aria-label={ts('title')}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500/20 text-teal-300 ring-1 ring-teal-400/30">
              <MessageCircle className="h-4 w-4" aria-hidden />
            </span>
            <span className="pr-0.5">{ts('dock')}</span>
          </m.button>
        ) : null}
      </AnimatePresence>

      <SupportRequestModal open={open} onClose={close} />
    </>
  );
}
