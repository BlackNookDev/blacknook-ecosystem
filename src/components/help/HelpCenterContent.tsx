'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  CreditCard,
  HelpCircle,
  Layers,
  LayoutDashboard,
  Search,
  Shield,
  UserCog,
  type LucideIcon,
} from 'lucide-react';
import { HELP_CATEGORIES, searchHelp } from '../../../lib/helpCenter';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  genel: HelpCircle,
  servisler: Layers,
  panel: LayoutDashboard,
  hesap: UserCog,
  odeme: CreditCard,
  guvenlik: Shield,
};

export default function HelpCenterContent() {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchHelp(query), [query]);
  const searching = query.trim().length > 0;

  return (
    <main className="relative overflow-hidden px-6 pb-24 pt-28 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[42vh] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_58%)]"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Destek
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Blacknook Yardım
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          Keşif, kurulum talebi, departman paneli ve hesap hakkında yanıtlar.
        </p>

        <label className="relative mx-auto mt-8 block max-w-xl">
          <span className="sr-only">Yardımda ara</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sorunu yaz… örn. kurulum, panel, katalog"
            className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/25 focus:ring-2 focus:ring-white/10"
          />
        </label>
      </div>

      {searching ? (
        <div className="relative mx-auto mt-12 max-w-3xl">
          <p className="mb-4 text-sm text-zinc-500">
            {results.length} sonuç · “{query.trim()}”
          </p>
          {results.length === 0 ? (
            <p className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-8 text-center text-sm text-zinc-500">
              Eşleşen makale bulunamadı. Kategorilere göz atın veya{' '}
              <a href="mailto:contact@blacknook.com" className="text-zinc-300 underline">
                contact@blacknook.com
              </a>{' '}
              adresine yazın.
            </p>
          ) : (
            <ul className="space-y-3">
              {results.map(({ category, article }) => (
                <li key={`${category.slug}-${article.id}`}>
                  <Link
                    href={`/help/${category.slug}#${article.id}`}
                    className="block rounded-2xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                      {category.title}
                    </p>
                    <p className="mt-1 font-medium text-zinc-100">{article.title}</p>
                    <p className="mt-0.5 text-sm text-zinc-500">{article.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="relative mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HELP_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug] ?? HelpCircle;
            return (
              <Link
                key={cat.slug}
                href={`/help/${cat.slug}`}
                className="group flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <ChevronRight
                    className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-400"
                    aria-hidden
                  />
                </div>
                <h2 className="mt-4 font-display text-base font-semibold text-white">{cat.title}</h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-zinc-500">{cat.description}</p>
                <p className="mt-4 text-xs text-zinc-600">{cat.articles.length} makale</p>
              </Link>
            );
          })}
        </div>
      )}

      <div className="relative mx-auto mt-16 grid max-w-3xl gap-4 sm:grid-cols-2">
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-8">
          <BookOpen className="h-8 w-8 shrink-0 text-zinc-400" aria-hidden />
          <div className="flex-1">
            <p className="font-medium text-zinc-100">Online işletme rehberi</p>
            <p className="mt-1 text-sm text-zinc-500">
              Dijital ürün ve online iş kurmaya dair pratik bir başlangıç rehberi.
            </p>
          </div>
          <Link
            href="/learn/online-isletme"
            className="inline-flex h-10 items-center rounded-full bg-white px-4 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Rehberi aç
          </Link>
        </div>
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-8">
          <BookOpen className="h-8 w-8 shrink-0 text-zinc-400" aria-hidden />
          <div className="flex-1">
            <p className="font-medium text-zinc-100">İçerik üreticileri</p>
            <p className="mt-1 text-sm text-zinc-500">
              Platformlar, gelir modelleri ve 2026’ya dair pratik bir rehber.
            </p>
          </div>
          <Link
            href="/learn/creator-economy"
            className="inline-flex h-10 items-center rounded-full border border-white/15 px-4 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/[0.06]"
          >
            Rehberi aç
          </Link>
        </div>
      </div>
    </main>
  );
}
