'use client';

import Link from 'next/link';
import { ArrowRight, Compass, LayoutDashboard, Rocket, Users } from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import BrandLogo from '@/components/BrandLogo';
import { duration, easePremium } from '@/components/motion/tokens';
import { NOOK_AGENT_LAUNCH_PATH } from '@/lib/nookAgent';

const MISSION = [
  {
    title: 'Tek otonom kokpit',
    body: 'Departman ajanlarını ve MCP’leri dağınık araçlar yerine tek panelde işletmek.',
  },
  {
    title: 'Keşfet → Kur → İşlet',
    body: 'Doğal dil ve katalog ile doğru ajanı bulmak; yönetilen kurulumla bağlamak; /agent’ta çalıştırmak.',
  },
  {
    title: 'Kurumsal barındırma esnekliği',
    body: 'KVKK uyumlu sistem, bulut veya müşteri sunucusu seçenekleriyle onboarding.',
  },
];

const HOW = [
  {
    icon: Compass,
    title: 'Keşif',
    body: 'Ana sayfa niyet araması ve ajan kataloğu ile ihtiyaca uygun çözümü bulun.',
  },
  {
    icon: Rocket,
    title: 'Yönetilen kurulum',
    body: 'Kurulum Talep Et ile operasyon ekibi uçtan uca onboarding yürütür.',
  },
  {
    icon: LayoutDashboard,
    title: 'Departman paneli',
    body: '/agent üzerinde Studio, entegrasyonlar ve departman ajanlarını işletirsiniz.',
  },
];

const AUDIENCE = [
  {
    icon: Users,
    side: 'İşletmeler & ekipler',
    points: [
      'Departman bazlı ajan ve MCP işletimi',
      'Tek noktadan keşif ve kurulum talebi',
      'KVKK / bulut / kendi sunucu seçenekleri',
    ],
  },
  {
    icon: LayoutDashboard,
    side: 'Operasyon & IT',
    points: [
      'Yönetilen onboarding hattı',
      'Entegrasyon ve Studio yüzeyi',
      'Tek kokpitte görünürlük',
    ],
  },
];

export default function AboutContent() {
  const reduce = useReducedMotion();

  return (
    <main className="relative bg-transparent">
      <section className="relative overflow-hidden px-6 pb-20 pt-32 text-center sm:pb-28 sm:pt-40">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-1/2 top-[38%] h-[42vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07)_0%,transparent_68%)] blur-2xl" />
        </div>

        <m.div
          className="relative z-10 mx-auto max-w-4xl"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.scene, ease: easePremium }}
        >
          <div className="mx-auto mb-8 flex justify-center">
            <BrandLogo textClassName="text-xl" iconClassName="h-8 w-8" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Hakkımızda
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Blacknook
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            İşletmenin otonom operasyon paneli — ajanları keşfedin, yönetilen kurulumla
            bağlayın, tek kokpitte işletin.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/services"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-zinc-950 hover:opacity-90"
            >
              Ajan kataloğu
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={NOOK_AGENT_LAUNCH_PATH}
              className="inline-flex h-11 items-center rounded-full border border-white/15 px-5 text-sm font-semibold text-zinc-200 hover:bg-white/[0.05]"
            >
              Departman paneli
            </Link>
          </div>
        </m.div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Misyon</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-3">
          {MISSION.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
            >
              <h3 className="font-display text-base font-semibold text-zinc-100">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Nasıl çalışır</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-3">
          {HOW.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.title}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
              >
                <Icon className="h-5 w-5 text-teal-400" aria-hidden />
                <h3 className="mt-3 font-display text-base font-semibold text-zinc-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.body}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-28">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Kimler için</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {AUDIENCE.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.side}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-zinc-400" aria-hidden />
                  <h3 className="font-display text-base font-semibold text-zinc-100">{item.side}</h3>
                </div>
                <ul className="mt-4 space-y-2">
                  {item.points.map((p) => (
                    <li key={p} className="text-sm text-zinc-400">
                      · {p}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
