'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, Search, Sparkles } from 'lucide-react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import SearchGapFeedbackModal from '@/components/home/SearchGapFeedbackModal';
import { fadeUp, staggerContainer, duration, easePremium } from '@/components/motion/tokens';
import {
  INTENT_SEARCH_EXAMPLES,
  searchCatalogByIntent,
  type IntentMatch,
  type IntentTech,
} from '@/lib/intentCatalogSearch';
import { useInstallRequestNavigate } from '@/lib/useInstallRequestNavigate';
import { cn } from '@/lib/utils';
import { getHeroAgents, getServiceBySlug } from '../../../lib/data';

/** Arama çevresinde dağınık; BN markası / shopppro yok; Notion ile doldurulur */
const FLOATING_STYLES: Array<{
  top: string;
  left?: string;
  right?: string;
  rotate: number;
  size: 'sm' | 'md' | 'lg';
}> = [
  { top: '10%', left: '8%', rotate: -12, size: 'lg' },
  { top: '16%', right: '9%', rotate: 10, size: 'md' },
  { top: '38%', left: '4%', rotate: 8, size: 'md' },
  { top: '48%', right: '5%', rotate: -8, size: 'lg' },
  { top: '68%', left: '11%', rotate: -6, size: 'md' },
  { top: '72%', right: '12%', rotate: 14, size: 'md' },
];

const FLOATING = [
  ...getHeroAgents().filter((s) => s.slug !== 'shopppro' && s.slug !== 'nook-muhasebe-mcp'),
  getServiceBySlug('mcp-notion-mcp'),
]
  .filter((s): s is NonNullable<typeof s> => Boolean(s))
  .slice(0, FLOATING_STYLES.length)
  .map((s, i) => ({
    ...s,
    style: FLOATING_STYLES[i],
    delay: i * 0.35,
  }));

export default function HomeProductShowcase() {
  const reduce = useReducedMotion();
  const inputId = useId();
  const goInstall = useInstallRequestNavigate();
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [techs, setTechs] = useState<IntentTech[]>([]);
  const [matches, setMatches] = useState<IntentMatch[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const selected = matches.find((m) => m.service.slug === selectedSlug)?.service;
  const hasQuery = query.trim().length > 0;
  const showResults = hasQuery && !searching;

  useEffect(() => {
    if (!matches.length) {
      setSelectedSlug(null);
      return;
    }
    if (!selectedSlug || !matches.some((m) => m.service.slug === selectedSlug)) {
      setSelectedSlug(matches[0].service.slug);
    }
  }, [matches, selectedSlug]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setSubmitted('');
      setMatches([]);
      setTechs([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = window.setTimeout(() => {
      const result = searchCatalogByIntent(q, 6);
      setSubmitted(q);
      setTechs(result.techs);
      setMatches(result.matches);
      setSearching(false);
    }, 180);

    return () => window.clearTimeout(timer);
  }, [query]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section
      className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden"
      aria-label="Blacknook — doğal dil ile ajan ve MCP ara"
    >
      <AnimatePresence>
        {!hasQuery ? (
          <m.div
            key="hero-floating-icons"
            className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
            aria-hidden
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.45, ease: easePremium }}
          >
            {FLOATING.map((item) =>
              item.style ? (
                <m.div
                  key={item.slug}
                  className="absolute"
                  style={{
                    top: item.style.top,
                    left: item.style.left,
                    right: item.style.right,
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
              ) : null
            )}
          </m.div>
        ) : null}
      </AnimatePresence>

      <m.div
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 pb-16 pt-28 sm:px-6 sm:pt-32"
        variants={reduce ? undefined : staggerContainer}
        initial={reduce ? false : 'hidden'}
        animate="visible"
      >
        <m.div variants={reduce ? undefined : fadeUp} className="flex flex-col items-center text-center">
          <p className="max-w-md font-display text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
            Aradığınız çözümü tarif edin
          </p>
        </m.div>

        <m.form
          variants={reduce ? undefined : fadeUp}
          onSubmit={onSubmit}
          className="relative isolate mt-8 w-full"
        >
          {/* Arama arkası — koyu mavi ışık (arayüzün altında) */}
          <div
            className="pointer-events-none absolute left-1/2 top-[1.75rem] -z-10 h-44 w-[135%] max-w-none -translate-x-1/2 -translate-y-1/2 sm:h-52 sm:w-[155%]"
            aria-hidden
          >
            <div
              className="absolute inset-0 blur-3xl"
              style={{
                background:
                  'radial-gradient(ellipse 72% 55% at 50% 50%, rgba(30, 64, 175, 0.45) 0%, rgba(30, 58, 138, 0.22) 38%, rgba(15, 23, 42, 0.08) 62%, transparent 78%)',
              }}
            />
            <div
              className="absolute inset-[20%_10%] blur-2xl"
              style={{
                background:
                  'radial-gradient(ellipse 78% 42% at 50% 50%, rgba(37, 99, 235, 0.28) 0%, rgba(29, 78, 216, 0.1) 48%, transparent 72%)',
              }}
            />
            {!reduce ? (
              <m.div
                className="absolute inset-[30%_20%] blur-xl"
                style={{
                  background:
                    'radial-gradient(ellipse 88% 36% at 50% 50%, rgba(59, 130, 246, 0.18) 0%, transparent 70%)',
                }}
                animate={{ opacity: [0.5, 0.85, 0.5] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            ) : null}
          </div>

          <label htmlFor={inputId} className="sr-only">
            Aradığınız çözümü tarif edin
          </label>
          <div className="relative z-10 flex items-stretch rounded-2xl border border-white/12 bg-zinc-950/75 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-md focus-within:border-sky-400/35 focus-within:ring-2 focus-within:ring-sky-400/15">
            <div className="flex items-center pl-4 text-zinc-500">
              {searching ? (
                <Loader2 className="h-5 w-5 animate-spin text-sky-300" aria-hidden />
              ) : (
                <Search className="h-5 w-5" aria-hidden />
              )}
            </div>
            <input
              id={inputId}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Örn. WhatsApp’ımı Excel’ime entegre etmek istiyorum"
              className="min-w-0 flex-1 bg-transparent px-3 py-4 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none sm:px-4 sm:text-base"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!hasQuery}
              className="m-1.5 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-zinc-950 transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Bul
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <div className="relative z-10 mt-4 flex flex-wrap justify-center gap-2">
            {INTENT_SEARCH_EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setQuery(example)}
                className="max-w-full truncate rounded-full border border-white/10 bg-zinc-950/60 px-3 py-1.5 text-[11px] text-zinc-400 backdrop-blur-sm transition-colors hover:border-white/20 hover:text-zinc-200 sm:text-xs"
              >
                {example}
              </button>
            ))}
          </div>
        </m.form>

        <AnimatePresence mode="wait">
          {hasQuery ? (
            <m.div
              key="live-results"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: duration.base, ease: easePremium }}
              className="mt-10 w-full"
            >
              {searching && matches.length === 0 ? (
                <p className="flex items-center justify-center gap-2 text-sm text-zinc-400">
                  <Sparkles className="h-4 w-4 text-teal-300" aria-hidden />
                  Eşleşen MCP’ler listeleniyor…
                </p>
              ) : (
                <>
                  {techs.length > 0 ? (
                    <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                        Algılanan
                      </span>
                      {techs.map((tech) => (
                        <span
                          key={tech.id}
                          className="rounded-full border border-teal-400/25 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-100"
                        >
                          {tech.label}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {matches.length === 0 ? (
                    <div className="space-y-5 text-center">
                      <p className="text-sm text-zinc-400">
                        Eşleşme bulunamadı. Daha spesifik yazın veya talebinizi bize bildirin.
                      </p>
                      <button
                        type="button"
                        onClick={() => setFeedbackOpen(true)}
                        className="inline-flex w-full max-w-md items-center justify-center rounded-full border border-white/20 bg-transparent px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/[0.06] sm:w-auto"
                      >
                        Aradığınızı bulamadınız mı? Bize talebinizi bildirin
                      </button>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {matches.map(({ service, reasons }) => {
                        const active = service.slug === selectedSlug;
                        return (
                          <li key={service.slug}>
                            <button
                              type="button"
                              onClick={() => setSelectedSlug(service.slug)}
                              className={cn(
                                'flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-[border-color,background-color]',
                                active
                                  ? 'border-white/25 bg-white/[0.07]'
                                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/16 hover:bg-white/[0.04]'
                              )}
                            >
                              <ServiceCatalogLogo
                                icon={service.icon}
                                brandColor={service.brandColor}
                                name={service.name}
                                size="md"
                                framed
                              />
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold text-zinc-50">
                                  {service.name}
                                </span>
                                <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-zinc-400">
                                  {service.description}
                                </span>
                                {reasons.length > 0 ? (
                                  <span className="mt-2 flex flex-wrap gap-1.5">
                                    {reasons.map((reason) => (
                                      <span
                                        key={reason}
                                        className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-zinc-400"
                                      >
                                        {reason}
                                      </span>
                                    ))}
                                  </span>
                                ) : null}
                              </span>
                              <Link
                                href={`/service/${service.slug}`}
                                onClick={(e) => e.stopPropagation()}
                                className="shrink-0 text-[11px] font-semibold text-teal-300/90 hover:text-teal-200"
                              >
                                İncele
                              </Link>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {selected ? (
                    <div className="mt-6 flex flex-col items-stretch gap-3 sm:items-center">
                      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            goInstall({
                              slug: selected.slug,
                              name: selected.name,
                              hint: submitted,
                            })
                          }
                          className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-bold text-zinc-950 transition-opacity hover:opacity-90"
                        >
                          Kurulum Talep Et
                        </button>
                        <button
                          type="button"
                          onClick={() => setFeedbackOpen(true)}
                          className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-5 py-3.5 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/[0.06]"
                        >
                          Aradığınızı bulamadınız mı? Bize talebinizi bildirin
                        </button>
                      </div>
                      <p className="text-center text-xs text-zinc-500">
                        Seçili: <span className="text-zinc-300">{selected.name}</span>
                      </p>
                    </div>
                  ) : showResults && matches.length > 0 ? (
                    <div className="mt-6 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setFeedbackOpen(true)}
                        className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/[0.06]"
                      >
                        Aradığınızı bulamadınız mı? Bize talebinizi bildirin
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </m.div>
          ) : null}
        </AnimatePresence>
      </m.div>

      <SearchGapFeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        searchQuery={submitted || query}
      />
    </section>
  );
}
