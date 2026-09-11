'use client';

import { useMemo, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { PitchGlowCard } from '@/components/pitch/ui/PitchGlowCard';
import { PitchScrollReveal } from '@/components/pitch/ui/PitchScrollReveal';
import {
  FX_USD,
  OPEX_ANNUAL,
  OPEX_LINES,
  OPEX_MONTHLY,
  PROJECTION_META,
  UNIT,
  buildMonthlyProjection,
  buildQuarterSummaries,
  computeYearTotals,
  fmtTl,
  fmtUsd,
} from '@/lib/pitchFinancial';
import { cn } from '@/lib/utils';

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[11px] font-display font-semibold uppercase tracking-[0.16em] text-zinc-500">
      {children}
    </h2>
  );
}

function ParamTable({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string; highlight?: boolean }[];
}) {
  return (
    <PitchGlowCard color="teal" className="h-full">
      <p className="mb-3 text-[11px] font-display font-semibold uppercase tracking-widest text-zinc-500">
        {title}
      </p>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-[10px] uppercase tracking-wider text-zinc-600">
            <th className="pb-2 font-semibold">Parametre</th>
            <th className="pb-2 text-right font-semibold">Değer</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-white/[0.05] last:border-0">
              <td
                className={cn(
                  'py-2.5 pr-3 text-zinc-400',
                  row.highlight && 'font-semibold text-zinc-100'
                )}
              >
                {row.label}
              </td>
              <td
                className={cn(
                  'py-2.5 text-right font-medium tabular-nums text-zinc-100',
                  row.highlight && 'font-bold text-teal-200'
                )}
              >
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PitchGlowCard>
  );
}

function Kpi({
  label,
  value,
  sub,
  tone = 'default',
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'default' | 'positive' | 'accent';
}) {
  return (
    <PitchGlowCard color="white" className="h-full">
      <p className="text-[11px] leading-snug text-zinc-500">{label}</p>
      <p
        className={cn(
          'mt-2 font-display text-xl font-bold tabular-nums md:text-2xl',
          tone === 'positive' && 'text-emerald-400',
          tone === 'accent' && 'text-teal-300',
          tone === 'default' && 'text-zinc-50'
        )}
      >
        {value}
      </p>
      {sub ? <p className="mt-1 text-[10px] text-zinc-600">{sub}</p> : null}
    </PitchGlowCard>
  );
}

function moneyClass(n: number) {
  if (n > 0) return 'text-emerald-400';
  if (n < 0) return 'text-red-400/90';
  return 'text-zinc-300';
}

export default function PitchFinancialView() {
  const rows = useMemo(() => buildMonthlyProjection(), []);
  const quarters = useMemo(() => buildQuarterSummaries(rows), [rows]);
  const year = useMemo(() => computeYearTotals(rows), [rows]);
  const reportDate = new Date().toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const revenueParams = [
    { label: 'Para birimi', value: UNIT.currency },
    { label: 'Tek seferlik kurulum / onboarding', value: fmtTl(UNIT.setup) },
    { label: 'Aylık platform lisans (MRR)', value: fmtTl(UNIT.licenseMrr) },
    { label: 'Aylık model lisansı', value: fmtTl(UNIT.modelMrr) },
    {
      label: 'Toplam aylık retainer',
      value: fmtTl(UNIT.retainerMrr),
      highlight: true,
    },
    {
      label: 'İlk yıl ACV (kurulum + 12 ay)',
      value: fmtTl(UNIT.acvYear1),
      highlight: true,
    },
  ];

  const costParams = [
    ...OPEX_LINES.map((l) => ({
      label: l.label,
      value: `${fmtTl(l.monthly)} / ay`,
    })),
    {
      label: 'Toplam aylık sabit OPEX',
      value: fmtTl(OPEX_MONTHLY),
      highlight: true,
    },
    {
      label: 'Toplam yıllık OPEX',
      value: fmtTl(OPEX_ANNUAL),
      highlight: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bn-bg,#161618)] pb-24 pt-28 text-zinc-100">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6">
        <Link
          href="/pitch#is-modeli"
          className="inline-flex items-center gap-1.5 text-sm text-teal-300/90 underline-offset-4 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Pitch — iş modeli
        </Link>

        <PitchScrollReveal className="mt-8 border-b border-white/[0.08] pb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-display font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Blacknook
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-zinc-50 md:text-4xl">
                {PROJECTION_META.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                {PROJECTION_META.subtitle}
              </p>
            </div>
            <div className="text-left text-xs leading-relaxed text-zinc-500 lg:text-right">
              <p>
                Tarih: <span className="text-zinc-300">{reportDate}</span>
              </p>
              <p>
                Kur referansı: <span className="text-zinc-300">{FX_USD} ₺ / USD</span>
              </p>
              <p>Hedef Y1: 50 kurumsal müşteri</p>
            </div>
          </div>
        </PitchScrollReveal>

        <PitchScrollReveal delay={0.04} className="mt-6">
          <div className="rounded-xl border border-teal-500/25 bg-teal-500/[0.07] px-4 py-3 text-sm leading-relaxed text-teal-100/90">
            {PROJECTION_META.note}
          </div>
        </PitchScrollReveal>

        {/* Parametreler */}
        <section className="mt-12 space-y-4">
          <SectionLabel>1 · Birim ekonomi & OPEX</SectionLabel>
          <div className="grid gap-4 lg:grid-cols-2">
            <ParamTable title="Gelir parametreleri" rows={revenueParams} />
            <ParamTable title="Aylık sabit operasyonel giderler" rows={costParams} />
          </div>
        </section>

        {/* Yıl sonu KPI */}
        <section className="mt-14 space-y-4">
          <SectionLabel>2 · Yıl sonu çıktılar (12. ay)</SectionLabel>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Aktif müşteri" value={`${year.customers}`} tone="accent" />
            <Kpi
              label="Yıllık brüt ciro"
              value={fmtTl(year.gross, true)}
              sub={fmtUsd(year.gross)}
            />
            <Kpi
              label="Exit MRR"
              value={fmtTl(year.exitMrr, true)}
              sub={`${fmtUsd(year.exitMrr)} / ay`}
              tone="accent"
            />
            <Kpi
              label="Exit ARR"
              value={fmtTl(year.exitArr, true)}
              sub={fmtUsd(year.exitArr)}
              tone="accent"
            />
            <Kpi label="Kümülatif kurulum" value={fmtTl(year.setup, true)} />
            <Kpi label="Kümülatif lisans" value={fmtTl(year.license, true)} />
            <Kpi label="Kümülatif model" value={fmtTl(year.model, true)} />
            <Kpi
              label="EBITDA (net faaliyet)"
              value={fmtTl(year.ebitda, true)}
              sub={`Marj %${year.marginPct.toLocaleString('tr-TR', { maximumFractionDigits: 1 })}`}
              tone="positive"
            />
          </div>
          <p className="text-xs text-zinc-500">
            Başa baş: aylık net ≥ 0 ve ≥3 kurulum →{' '}
            <span className="text-zinc-300">
              {year.breakEvenMonth ? `${year.breakEvenMonth}. ay` : '—'}
            </span>
            {' · '}
            kümülatif nakit ≥ 0 →{' '}
            <span className="text-zinc-300">
              {year.breakEvenCumulativeMonth
                ? `${year.breakEvenCumulativeMonth}. ay`
                : '—'}
            </span>
            . (Brief: 2. ay / 3 kurulum.)
          </p>
        </section>

        {/* Çeyrek özet */}
        <section className="mt-14 space-y-4">
          <SectionLabel>3 · Çeyreklik büyüme</SectionLabel>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="bg-white/[0.04] text-left text-[10px] uppercase tracking-wider text-zinc-500">
                    <th className="px-4 py-3 font-semibold">Çeyrek</th>
                    <th className="px-4 py-3 font-semibold">Dönem</th>
                    <th className="px-4 py-3 text-right font-semibold">Yeni</th>
                    <th className="px-4 py-3 text-right font-semibold">Kümülatif</th>
                    <th className="px-4 py-3 text-right font-semibold">Kurulum cirosu</th>
                    <th className="px-4 py-3 text-right font-semibold">Çeyrek sonu MRR</th>
                  </tr>
                </thead>
                <tbody>
                  {quarters.map((q) => (
                    <tr
                      key={q.quarter}
                      className="border-t border-white/[0.06] hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3 font-display font-semibold text-zinc-100">
                        {q.quarter}. Çeyrek
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{q.months}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-zinc-200">
                        {q.newCustomers}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-zinc-200">
                        {q.cumulativeCustomers}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-zinc-200">
                        {fmtTl(q.setupRevenue)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold text-teal-200">
                        {fmtTl(q.endMrr)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Excel-like monthly sheet */}
        <section className="mt-14 space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <SectionLabel>4 · Aylık P&amp;L tablosu (Excel görünümü)</SectionLabel>
            <p className="text-[10px] text-zinc-600">
              Yatay kaydır · tüm değerler ₺
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#0c0c0e] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            {/* Sheet header bar */}
            <div className="flex items-center gap-2 border-b border-white/[0.08] bg-white/[0.03] px-3 py-2.5 sm:px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="ml-2 font-mono text-[11px] text-zinc-500">
                Blacknook_Y1_Finansal_Plan.xlsx — Sheet1
              </span>
              <span className="ml-auto hidden items-center gap-1 text-[10px] text-zinc-600 sm:inline-flex">
                <Download className="h-3 w-3" aria-hidden />
                Ekran görüntüsü / kopyala
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse font-mono text-[11px] sm:text-xs">
                <thead>
                  <tr className="bg-[#1a1a1e] text-[10px] uppercase tracking-wide text-zinc-500">
                    {[
                      'Ay',
                      'Q',
                      'Yeni',
                      'Aktif',
                      'Kurulum',
                      'Lisans',
                      'Model',
                      'Toplam gelir',
                      'OPEX',
                      'Net',
                      'Küm. net',
                      'MRR',
                    ].map((h) => (
                      <th
                        key={h}
                        className="sticky top-0 border-b border-white/10 px-2.5 py-3 text-right font-semibold first:text-left sm:px-3"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr
                      key={r.month}
                      className={cn(
                        'border-b border-white/[0.04]',
                        idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.015]',
                        r.quarter === 2 && 'bg-teal-500/[0.03]',
                        r.quarter === 4 && 'bg-emerald-500/[0.03]'
                      )}
                    >
                      <td className="px-2.5 py-2.5 text-left font-semibold text-zinc-200 sm:px-3">
                        {r.label}
                      </td>
                      <td className="px-2.5 py-2.5 text-right text-zinc-500 sm:px-3">
                        Q{r.quarter}
                      </td>
                      <td className="px-2.5 py-2.5 text-right tabular-nums text-zinc-300 sm:px-3">
                        {r.newCustomers}
                      </td>
                      <td className="px-2.5 py-2.5 text-right tabular-nums font-semibold text-zinc-100 sm:px-3">
                        {r.activeCustomers}
                      </td>
                      <td className="px-2.5 py-2.5 text-right tabular-nums text-zinc-300 sm:px-3">
                        {fmtTl(r.setupRevenue)}
                      </td>
                      <td className="px-2.5 py-2.5 text-right tabular-nums text-zinc-300 sm:px-3">
                        {fmtTl(r.licenseRevenue)}
                      </td>
                      <td className="px-2.5 py-2.5 text-right tabular-nums text-zinc-300 sm:px-3">
                        {fmtTl(r.modelRevenue)}
                      </td>
                      <td className="px-2.5 py-2.5 text-right tabular-nums font-semibold text-zinc-50 sm:px-3">
                        {fmtTl(r.totalRevenue)}
                      </td>
                      <td className="px-2.5 py-2.5 text-right tabular-nums text-zinc-500 sm:px-3">
                        {fmtTl(r.opex)}
                      </td>
                      <td
                        className={cn(
                          'px-2.5 py-2.5 text-right tabular-nums font-semibold sm:px-3',
                          moneyClass(r.net)
                        )}
                      >
                        {fmtTl(r.net)}
                      </td>
                      <td
                        className={cn(
                          'px-2.5 py-2.5 text-right tabular-nums sm:px-3',
                          moneyClass(r.cumulativeNet)
                        )}
                      >
                        {fmtTl(r.cumulativeNet)}
                      </td>
                      <td className="px-2.5 py-2.5 text-right tabular-nums text-teal-200/90 sm:px-3">
                        {fmtTl(r.mrr)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-white/[0.06] font-semibold">
                    <td className="px-2.5 py-3 text-left text-zinc-100 sm:px-3" colSpan={2}>
                      Yıl toplamı
                    </td>
                    <td className="px-2.5 py-3 text-right tabular-nums text-zinc-100 sm:px-3">
                      {year.customers}
                    </td>
                    <td className="px-2.5 py-3 text-right tabular-nums text-zinc-100 sm:px-3">
                      {year.customers}
                    </td>
                    <td className="px-2.5 py-3 text-right tabular-nums text-zinc-100 sm:px-3">
                      {fmtTl(year.setup)}
                    </td>
                    <td className="px-2.5 py-3 text-right tabular-nums text-zinc-100 sm:px-3">
                      {fmtTl(year.license)}
                    </td>
                    <td className="px-2.5 py-3 text-right tabular-nums text-zinc-100 sm:px-3">
                      {fmtTl(year.model)}
                    </td>
                    <td className="px-2.5 py-3 text-right tabular-nums text-teal-200 sm:px-3">
                      {fmtTl(year.gross)}
                    </td>
                    <td className="px-2.5 py-3 text-right tabular-nums text-zinc-400 sm:px-3">
                      {fmtTl(year.opex)}
                    </td>
                    <td className="px-2.5 py-3 text-right tabular-nums text-emerald-400 sm:px-3">
                      {fmtTl(year.ebitda)}
                    </td>
                    <td className="px-2.5 py-3 text-right tabular-nums text-emerald-400 sm:px-3">
                      {fmtTl(year.ebitda)}
                    </td>
                    <td className="px-2.5 py-3 text-right tabular-nums text-teal-200 sm:px-3">
                      {fmtTl(year.exitMrr)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        <p className="mt-8 text-center text-[10px] uppercase tracking-[0.12em] text-zinc-600">
          Yatırımcı özeti · senaryo varsayımlara bağlıdır · hassas metrikler görüşmede
        </p>
      </div>
    </div>
  );
}
