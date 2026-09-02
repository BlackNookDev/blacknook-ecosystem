'use client';

import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import { getRotatingPlatformHint } from '../../../lib/developerPresence';
import { useMatchPool } from '@/components/presence/useMatchPool';
import DeveloperAvatars from '@/components/presence/DeveloperAvatars';
import { duration, easePremium } from '@/components/motion/tokens';
import { useEffect, useState } from 'react';

export default function HeroPresenceStrip() {
  const reduce = useReducedMotion();
  const { count, people } = useMatchPool();
  const [hint, setHint] = useState(() => getRotatingPlatformHint());

  useEffect(() => {
    const id = window.setInterval(() => setHint(getRotatingPlatformHint()), 20_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <m.div
      className="relative z-10 mt-5 flex flex-col items-center gap-2"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.45, duration: duration.base, ease: easePremium }}
    >
      <div className="flex items-center gap-2.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 backdrop-blur-sm">
        <DeveloperAvatars people={people} count={Math.min(5, people.length)} size="sm" />
        <p className="text-[11px] text-zinc-500">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 align-middle" />
          {count > 0 ? (
            <>
              <span className="font-medium text-zinc-300">{count}</span>
              <span className="text-zinc-500"> uzman destek hattında</span>
            </>
          ) : (
            <span className="text-zinc-400">Destek talepleri ekibe düşer</span>
          )}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <m.p
          key={hint.id}
          className="max-w-sm text-center text-[11px] text-zinc-600"
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35 }}
        >
          {hint.message}
        </m.p>
      </AnimatePresence>
    </m.div>
  );
}
