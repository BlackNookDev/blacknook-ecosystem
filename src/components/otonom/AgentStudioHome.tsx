'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { m, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  LayoutGrid,
  Mic,
  Plus,
  Search,
  Sparkles,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import SimulationBackLink from '@/components/simulations/SimulationBackLink';
import { cn } from '@/lib/utils';

const PROMPT_EXAMPLES = [
  'Satış ekibi CRM ajanını yapılandır',
  'Destek için Chatwoot gelen kutusu ajanı',
  'Operasyon stok uyarı ajanı önizlemesi',
  'Muhasebe departmanı için WhatsApp masraf ajanı',
] as const;

const PROJECTS = [
  {
    id: 'blank',
    title: 'Yeni ajan yapılandırması',
    tag: 'Kurulum',
    tone: 'from-zinc-500/25 via-zinc-800/40 to-zinc-950',
  },
] as const;

type Props = {
  onOpenWorkspace: (prompt: string) => void;
  onCreate: (prompt: string) => void;
  busy?: boolean;
  error?: string | null;
};

export default function AgentStudioHome({
  onOpenWorkspace,
  onCreate,
  busy = false,
  error = null,
}: Props) {
  const { data: session } = useSession();
  const reduce = useReducedMotion();
  const [prompt, setPrompt] = useState('');
  const [tab, setTab] = useState<'mine' | 'recent' | 'templates'>('mine');

  const firstName = useMemo(() => {
    const name = session?.user?.name?.trim();
    if (name) return name.split(/\s+/)[0] ?? name;
    const email = session?.user?.email?.trim();
    if (email) return email.split('@')[0] ?? 'sen';
    return 'sen';
  }, [session?.user?.email, session?.user?.name]);

  const greeting =
    firstName === 'sen'
      ? 'Hangi departman ajanını yapılandıralım?'
      : `${firstName}, hangi ajanı yapılandıralım?`;

  const submit = () => {
    if (busy) return;
    const value = prompt.trim() || 'Muhasebe departmanı için operasyon ajanı yapılandır';
    onCreate(value);
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[#07090f]" />
        <m.div
          className="absolute -left-[20%] top-[-10%] h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.45)_0%,transparent_68%)] blur-3xl"
          animate={reduce ? undefined : { x: [0, 40, -20, 0], y: [0, 30, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <m.div
          className="absolute right-[-15%] top-[5%] h-[65vmin] w-[65vmin] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.38)_0%,transparent_70%)] blur-3xl"
          animate={reduce ? undefined : { x: [0, -50, 10, 0], y: [0, 20, -15, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <m.div
          className="absolute bottom-[-20%] left-[25%] h-[55vmin] w-[80vmin] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.28)_0%,transparent_72%)] blur-3xl"
          animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,9,15,0.55)_70%,rgba(7,9,15,0.9)_100%)]" />
      </div>

      <aside className="absolute bottom-4 left-4 top-4 z-20 hidden w-[15.5rem] flex-col rounded-3xl border border-white/10 bg-black/45 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:flex">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <Image src="/bn-mark.png" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {firstName === 'sen' ? 'Ajan yapılandırma' : `${firstName} · Ajanlar`}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              Kurulum
            </p>
          </div>
        </div>

        <nav className="mt-4 space-y-1">
          <SideLink active icon={<LayoutGrid className="h-4 w-4" />} label="Panel" />
          <SideLink icon={<Search className="h-4 w-4" />} label="Ara" hint="⌘K" />
          <SideLink icon={<Sparkles className="h-4 w-4" />} label="Bağlantılar" />
        </nav>

        <p className="mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Ajanlar
        </p>
        <nav className="space-y-1">
          <SideLink icon={<LayoutGrid className="h-4 w-4" />} label="Tüm ajanlar" />
          <SideLink icon={<Star className="h-4 w-4" />} label="Yıldızlı" />
          <SideLink icon={<ArrowUpRight className="h-4 w-4" />} label="Şirketime ait" />
        </nav>

        <div className="mt-auto rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3">
          <p className="text-sm font-semibold text-emerald-100">Kurulum sihirbazı</p>
          <p className="mt-1 text-xs leading-relaxed text-emerald-100/70">
            Departman ve MCP bağlantısını tanımlayın, önizleyin.
          </p>
        </div>
      </aside>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col lg:pl-[17rem]">
        <header className="flex shrink-0 items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <SimulationBackLink fallback="/agent" aria-label="Panele dön" />
            <Image
              src="/bn-mark.png"
              alt=""
              width={22}
              height={22}
              className="h-5 w-5 object-contain brightness-0 invert"
            />
          </div>
          <div className="hidden lg:block">
            <SimulationBackLink fallback="/agent" aria-label="Panele dön" />
          </div>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold text-zinc-200 backdrop-blur-md">
            Ajan kurulum sihirbazı
          </span>
        </header>

        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 sm:px-6 lg:px-10">
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center pt-4 text-center">
            <m.h1
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="font-display text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-[-0.03em] text-white"
            >
              {greeting}
            </m.h1>

            <m.form
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mt-8 w-full"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <div className="flex items-center gap-2 rounded-[1.75rem] border border-white/15 bg-black/45 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:gap-3 sm:p-2.5">
                <button
                  type="button"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-zinc-400 transition hover:bg-white/5 hover:text-white"
                  aria-label="Ekle"
                >
                  <Plus className="h-5 w-5" />
                </button>
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Örn. Muhasebe için WhatsApp masraf ajanı yapılandır…"
                  disabled={busy}
                  className="min-w-0 flex-1 bg-transparent py-3 text-left text-[15px] text-zinc-100 outline-none placeholder:text-zinc-500 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-zinc-950 transition hover:opacity-90 disabled:opacity-50"
                >
                  {busy ? 'Üretiliyor…' : 'Oluştur'}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-zinc-400 transition hover:bg-white/5 hover:text-white sm:flex"
                  aria-label="Sesli giriş"
                >
                  <Mic className="h-4 w-4" />
                </button>
              </div>
            </m.form>

            {error ? (
              <p className="mt-3 max-w-xl text-sm text-rose-300" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {PROMPT_EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  disabled={busy}
                  onClick={() => setPrompt(example)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:opacity-50"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <m.section
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mx-auto mt-auto w-full max-w-6xl rounded-[1.75rem] border border-white/10 bg-black/40 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-5"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
                {(
                  [
                    ['mine', 'Projelerim'],
                    ['recent', 'Son görüntülenen'],
                    ['templates', 'Şablonlar'],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                      tab === id
                        ? 'bg-white text-zinc-950'
                        : 'text-zinc-400 hover:text-zinc-200'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onOpenWorkspace('Yeni proje')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 hover:text-emerald-200"
              >
                Tümünü gör
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {PROJECTS.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => onOpenWorkspace(project.title)}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] text-left transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <div
                    className={cn(
                      'relative aspect-[16/10] bg-gradient-to-br p-4',
                      project.tone
                    )}
                  >
                    <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-200 backdrop-blur-md">
                      {project.tag}
                    </span>
                    <div className="absolute inset-x-6 bottom-5 top-10 rounded-xl border border-white/10 bg-black/25 backdrop-blur-sm" />
                  </div>
                  <div className="flex items-center justify-between gap-2 px-3.5 py-3">
                    <p className="truncate text-sm font-semibold text-zinc-100">{project.title}</p>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-zinc-500 transition group-hover:text-white" />
                  </div>
                </button>
              ))}
            </div>
          </m.section>
        </div>
      </div>
    </div>
  );
}

function SideLink({
  icon,
  label,
  hint,
  active,
}: {
  icon: ReactNode;
  label: string;
  hint?: string;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        'flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm',
        active ? 'bg-white/10 font-medium text-white' : 'text-zinc-400'
      )}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {hint ? <span className="text-[10px] text-zinc-600">{hint}</span> : null}
    </span>
  );
}
