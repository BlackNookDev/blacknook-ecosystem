'use client';

import { ExternalLink } from 'lucide-react';
import { PitchGlowCard } from '@/components/pitch/ui/PitchGlowCard';
import { PitchScrollReveal } from '@/components/pitch/ui/PitchScrollReveal';
import { PITCH_ARGE_PRESS, PITCH_ARGE_PROJECTS } from '@/lib/pitchData';

function PastelaMiniUi() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#F9F6F0] text-[#2D2326]">
      <div className="flex items-center justify-between border-b border-[#2D2326]/10 px-3 py-2">
        <span className="font-display text-[10px] font-bold tracking-[0.14em]">PASTELA</span>
        <span className="text-[9px] font-medium text-[#2D2326]/55">AI Fabric Design Studio</span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[1.1fr_0.9fr] gap-2 p-2.5">
        <div className="flex flex-col gap-2">
          <div className="rounded-lg border border-[#2D2326]/10 bg-white/70 p-2">
            <p className="text-[8px] font-semibold uppercase tracking-wider text-[#2D2326]/45">
              1 · Kumaş Tasarımı
            </p>
            <div className="mt-1.5 h-7 rounded-md border border-dashed border-[#2D2326]/15 bg-[#F5E6E0]/60 px-2 text-[9px] leading-7 text-[#2D2326]/40">
              Desen açıklaması yazın…
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {['Çiçek', 'Dalga', 'Geometrik'].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-[#E8A598]/25 px-1.5 py-0.5 text-[8px] font-medium text-[#2D2326]/70"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-[#2D2326]/10 bg-white/70 p-2">
            <p className="text-[8px] font-semibold uppercase tracking-wider text-[#2D2326]/45">
              2 · Ölçek
            </p>
            <div className="mt-1.5 space-y-1">
              <div className="h-1 rounded-full bg-[#D4E8E0]" />
              <div className="h-1 w-4/5 rounded-full bg-[#A8C5D8]/70" />
              <div className="h-1 w-2/3 rounded-full bg-[#D8C8D4]/80" />
            </div>
            <p className="mt-1.5 text-[8px] text-[#2D2326]/45">110cm × 90cm · Baskıya hazır</p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg border border-[#2D2326]/10 bg-white shadow-sm">
          <div
            className="absolute inset-0 opacity-90"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, #E8A598 0 8%, transparent 9%),
                radial-gradient(circle at 70% 25%, #A8C5D8 0 6%, transparent 7%),
                radial-gradient(circle at 45% 70%, #D8C8D4 0 10%, transparent 11%),
                radial-gradient(circle at 80% 75%, #D4E8E0 0 7%, transparent 8%),
                linear-gradient(135deg, #F5E6E0, #F0D9C8 50%, #D4C5B8)
              `,
            }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2D2326]/35 to-transparent px-2 py-1.5">
            <p className="text-[8px] font-semibold text-white">Önizleme</p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#2D2326]/0 transition-colors group-hover:bg-[#2D2326]/25">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#2D2326]/75 px-3 py-1.5 text-[10px] font-semibold text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100">
          Canlıya git
          <ExternalLink className="h-3 w-3" aria-hidden />
        </span>
      </div>
    </div>
  );
}

export function PitchArgeProjects() {
  return (
    <section id="arge-projeleri" className="relative">
      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <PitchScrollReveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--bn-faint)]">
              Portföy
            </p>
            <h2 className="mt-3 font-display text-xl font-semibold tracking-tight text-[var(--bn-heading)] sm:text-2xl md:text-[1.65rem]">
              Daha Önce Geliştirilen Ar-Ge Projeleri
            </h2>
          </div>
        </PitchScrollReveal>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5">
          {PITCH_ARGE_PROJECTS.map((project, index) => (
            <PitchScrollReveal key={project.id} delay={Math.min(index * 0.05, 0.2)}>
              <li className="h-full">
                <PitchGlowCard color="sky" flush className="overflow-hidden">
                  {project.href ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block aspect-video overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
                      aria-label={`${project.title} canlı ürünü aç`}
                    >
                      <PastelaMiniUi />
                    </a>
                  ) : project.src ? (
                    <div className="relative aspect-video overflow-hidden bg-black/40">
                      <video
                        className="h-full w-full object-cover"
                        src={project.src}
                        controls
                        playsInline
                        preload="metadata"
                        aria-label={`${project.title} — ${project.subtitle}`}
                      />
                    </div>
                  ) : null}
                  <div className="px-4 py-3.5 sm:px-5 sm:py-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-base font-semibold text-[var(--bn-heading)]">
                          {project.title}
                        </p>
                        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-sky-300/80">
                          {project.subtitle}
                        </p>
                      </div>
                      {project.href ? (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-zinc-300 transition-colors hover:border-white/25 hover:text-white"
                        >
                          Aç
                          <ExternalLink className="h-3 w-3" aria-hidden />
                        </a>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--bn-subtitle)]">
                      {project.body}
                    </p>
                  </div>
                </PitchGlowCard>
              </li>
            </PitchScrollReveal>
          ))}
        </ul>

        <PitchScrollReveal delay={0.12}>
          <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--bn-faint)]">
              Basında
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {PITCH_ARGE_PRESS.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-[22rem] items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-200 sm:text-xs"
                    title={item.title}
                  >
                    <span className="font-medium text-zinc-300">{item.label}</span>
                    <span className="truncate text-zinc-500">· {item.title}</span>
                    <ExternalLink className="h-3 w-3 shrink-0 opacity-60" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </PitchScrollReveal>
      </div>
    </section>
  );
}
