import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { getHelpCategory } from '../../../lib/helpCenter';
import { notFound } from 'next/navigation';

type Props = { slug: string };

export default function HelpCategoryContent({ slug }: Props) {
  const category = getHelpCategory(slug);
  if (!category) notFound();

  return (
    <main className="relative overflow-hidden px-6 pb-24 pt-28 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[36vh] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-3xl">
        <Link
          href="/help"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Yardım
        </Link>
        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {category.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
          {category.description}
        </p>
        <p className="mt-2 text-xs text-zinc-600">{category.articles.length} makale</p>

        <ul className="mt-10 divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          {category.articles.map((article) => (
            <li key={article.id}>
              <a
                href={`#${article.id}`}
                className="group flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-white/[0.04] sm:px-6"
              >
                <div className="min-w-0">
                  <h2 className="font-display text-base font-semibold text-zinc-100 group-hover:text-white">
                    {article.title}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-500">{article.summary}</p>
                </div>
                <ChevronRight
                  className="mt-1 h-4 w-4 shrink-0 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-400"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-12 space-y-6">
          <h2 className="font-display text-lg font-semibold text-white">Makale detayları</h2>
          {category.articles.map((article) => (
            <article
              key={article.id}
              id={article.id}
              className="scroll-mt-28 rounded-2xl border border-white/[0.08] bg-zinc-950/40 px-5 py-5 sm:px-6"
            >
              <h3 className="font-display text-base font-semibold text-white">{article.title}</h3>
              <p className="mt-1 text-sm text-zinc-500">{article.summary}</p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{article.body}</p>
            </article>
          ))}
        </div>

        <p className="mt-10 text-sm text-zinc-500">
          Yanıt bulamadınız mı?{' '}
          <a href="mailto:contact@blacknook.com" className="text-zinc-300 underline underline-offset-2">
            contact@blacknook.com
          </a>
        </p>
      </div>
    </main>
  );
}
