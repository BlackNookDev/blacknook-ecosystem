'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { PitchGlowCard } from '@/components/pitch/ui/PitchGlowCard';
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
import { duration, easePremium } from '@/components/motion/tokens';
import { cn } from '@/lib/utils';

type PanelId = 'unit' | 'kpi' | 'quarter' | 'pnl';

const PANELS: { id: PanelId; title: string; summary: string }[] = [
  {
    id: 'unit',
    title: 'Birim ekonomi & OPEX',
    summary: 'Kurulum, retainer ve aylık sabit gider parametreleri',
  },
  {
    id: 'kpi',
    title: 'Yıl sonu çıktılar',
    summary: '50 müşteri · Exit MRR · EBITDA',
  },
  {
    id: 'quarter',
    title: 'Çeyreklik büyüme',
    summary: '6 / 10 / 14 / 20 yeni müşteri',
  },
  {
    id: 'pnl',
    title: 'Aylık P&L tablosu',
    summary: '12 aylık Excel görünümü',
  },
];

function moneyClass(n: number) {
  if (n > 0) return 'text-emerald-400';
  if (n < 0) return 'text-red-400/90';
  return 'text-zinc-300';
}

function AccordionCard({
  title,
  summary,
  open,
  onToggle,
  children,
}: {
  title: string;
  summary: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <PitchGlowCard color="sky" flush className="overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-3 px-4 py-4 text-left sm:px-5 sm:py-5"
      >
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-semibold text-zinc-50 sm:text-lg">
            {title}
          </p>
          <p className="mt-1 text-sm text-zinc-400">{summary}</p>
        </div>
        <m.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: duration.fast, ease: easePremium }}
          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sky-400/25 bg-sky-400/10 text-sky-200"
        >
          <ChevronDown className="h-4 w-4" aria-hidden />
        </m.span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <m.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: easePremium }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.06] px-4 pb-5 pt-4 sm:px-5">
              {children}
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </PitchGlowCard>
  );
}

function ParamBlock({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string; highlight?: boolean }[];
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
        {title}
      </p>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-white/[0.05] last:border-0">
              <td
                className={cn(
                  'py-2 pr-3 text-zinc-400',
                  row.highlight && 'font-semibold text-zinc-100'
                )}
              >
                {row.label}
              </td>
              <td
                className={cn(
                  'py-2 text-right font-medium tabular-nums text-zinc-100',
                  row.highlight && 'font-bold text-sky-200'
                )}
              >
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Ana pitch sayfasına gömülü — kartlar tıklanınca açılır */
export function PitchFinancialEmbed() {
  const [openId, setOpenId] = useState<PanelId | null>(null);
  const rows = useMemo(() => buildMonthlyProjection(), []);
  const quarters = useMemo(() => buildQuarterSummaries(rows), [rows]);
  const year = useMemo(() => computeYearTotals(rows), [rows]);

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

  const toggle = (id: PanelId) => {
    setOpenId((cur) => (cur === id ? null : id));
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-3">
      <div className="mb-2 px-1">
        <p className="font-display text-lg font-semibold text-zinc-50 md:text-xl">
          {PROJECTION_META.title}
        </p>
        <p className="mt-1 text-sm text-zinc-400">{PROJECTION_META.subtitle}</p>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          Kur: {FX_USD} ₺/USD · Hedef Y1: 50 kurumsal müşteri. Kartlara tıklayarak
          detayı açın.
        </p>
      </div>

      {PANELS.map((panel) => (
        <AccordionCard
          key={panel.id}
          title={panel.title}
          summary={panel.summary}
          open={openId === panel.id}
          onToggle={() => toggle(panel.id)}
        >
          {panel.id === 'unit' ? (
            <div className="grid gap-3 lg:grid-cols-2">
              <ParamBlock title="Gelir parametreleri" rows={revenueParams} />
              <ParamBlock title="Aylık sabit OPEX" rows={costParams} />
            </div>
          ) : null}

          {panel.id === 'kpi' ? (
            <div className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Aktif müşteri', value: `${year.customers}`, accent: true },
                  {
                    label: 'Yıllık brüt ciro',
                    value: fmtTl(year.gross, true),
                    sub: fmtUsd(year.gross),
                  },
                  {
                    label: 'Exit MRR',
                    value: fmtTl(year.exitMrr, true),
                    sub: `${fmtUsd(year.exitMrr)} / ay`,
                    accent: true,
                  },
                  {
                    label: 'Exit ARR',
                    value: fmtTl(year.exitArr, true),
                    sub: fmtUsd(year.exitArr),
                    accent: true,
                  },
                  { label: 'Kümülatif kurulum', value: fmtTl(year.setup, true) },
                  { label: 'Kümülatif lisans', value: fmtTl(year.license, true) },
                  { label: 'Kümülatif model', value: fmtTl(year.model, true) },
                  {
                    label: 'EBITDA',
                    value: fmtTl(year.ebitda, true),
                    sub: `Marj %${year.marginPct.toLocaleString('tr-TR', { maximumFractionDigits: 1 })}`,
                    positive: true,
                  },
                ].map((k) => (
                  <div
                    key={k.label}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-3"
                  >
                    <p className="text-[11px] text-zinc-500">{k.label}</p>
                    <p
                      className={cn(
                        'mt-1.5 font-display text-lg font-bold tabular-nums',
                        k.positive && 'text-emerald-400',
                        k.accent && 'text-sky-200',
                        !k.positive && !k.accent && 'text-zinc-50'
                      )}
                    >
                      {k.value}
                    </p>
                    {k.sub ? (
                      <p className="mt-0.5 text-[10px] text-zinc-600">{k.sub}</p>
                    ) : null}
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500">
                Başa baş (aylık net ≥ 0, ≥3 kurulum):{' '}
                <span className="text-zinc-300">
                  {year.breakEvenMonth ? `${year.breakEvenMonth}. ay` : '—'}
                </span>
                {' · '}
                kümülatif nakit ≥ 0:{' '}
                <span className="text-zinc-300">
                  {year.breakEvenCumulativeMonth
                    ? `${year.breakEvenCumulativeMonth}. ay`
                    : '—'}
                </span>
              </p>
            </div>
          ) : null}

          {panel.id === 'quarter' ? (
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="bg-white/[0.04] text-left text-[10px] uppercase tracking-wider text-zinc-500">
                    <th className="px-3 py-2.5 font-semibold">Çeyrek</th>
                    <th className="px-3 py-2.5 font-semibold">Dönem</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Yeni</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Kümülatif</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Kurulum</th>
                    <th className="px-3 py-2.5 text-right font-semibold">MRR</th>
                  </tr>
                </thead>
                <tbody>
                  {quarters.map((q) => (
                    <tr
                      key={q.quarter}
                      className="border-t border-white/[0.06] hover:bg-white/[0.02]"
                    >
                      <td className="px-3 py-2.5 font-semibold text-zinc-100">
                        {q.quarter}. Çeyrek
                      </td>
                      <td className="px-3 py-2.5 text-zinc-400">{q.months}</td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-zinc-200">
                        {q.newCustomers}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-zinc-200">
                        {q.cumulativeCustomers}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums text-zinc-200">
                        {fmtTl(q.setupRevenue)}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-sky-200">
                        {fmtTl(q.endMrr)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {panel.id === 'pnl' ? (
            <div className="overflow-hidden rounded-xl border border-white/12 bg-[#0c0c0e]">
              <div className="flex items-center gap-2 border-b border-white/[0.08] bg-white/[0.03] px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="ml-2 font-mono text-[10px] text-zinc-500">
                  Blacknook_Y1_Finansal_Plan.xlsx
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] border-collapse font-mono text-[10px] sm:text-[11px]">
                  <thead>
                    <tr className="bg-[#1a1a1e] text-[9px] uppercase tracking-wide text-zinc-500">
                      {[
                        'Ay',
                        'Q',
                        'Yeni',
                        'Aktif',
                        'Kurulum',
                        'Lisans',
                        'Model',
                        'Gelir',
                        'OPEX',
                        'Net',
                        'Küm. net',
                        'MRR',
                      ].map((h) => (
                        <th
                          key={h}
                          className="border-b border-white/10 px-2 py-2.5 text-right font-semibold first:text-left"
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
                          idx % 2 === 1 && 'bg-white/[0.015]'
                        )}
                      >
                        <td className="px-2 py-2 text-left font-semibold text-zinc-200">
                          {r.label}
                        </td>
                        <td className="px-2 py-2 text-right text-zinc-500">Q{r.quarter}</td>
                        <td className="px-2 py-2 text-right tabular-nums text-zinc-300">
                          {r.newCustomers}
                        </td>
                        <td className="px-2 py-2 text-right tabular-nums font-semibold text-zinc-100">
                          {r.activeCustomers}
                        </td>
                        <td className="px-2 py-2 text-right tabular-nums text-zinc-300">
                          {fmtTl(r.setupRevenue)}
                        </td>
                        <td className="px-2 py-2 text-right tabular-nums text-zinc-300">
                          {fmtTl(r.licenseRevenue)}
                        </td>
                        <td className="px-2 py-2 text-right tabular-nums text-zinc-300">
                          {fmtTl(r.modelRevenue)}
                        </td>
                        <td className="px-2 py-2 text-right tabular-nums font-semibold text-zinc-50">
                          {fmtTl(r.totalRevenue)}
                        </td>
                        <td className="px-2 py-2 text-right tabular-nums text-zinc-500">
                          {fmtTl(r.opex)}
                        </td>
                        <td
                          className={cn(
                            'px-2 py-2 text-right tabular-nums font-semibold',
                            moneyClass(r.net)
                          )}
                        >
                          {fmtTl(r.net)}
                        </td>
                        <td
                          className={cn(
                            'px-2 py-2 text-right tabular-nums',
                            moneyClass(r.cumulativeNet)
                          )}
                        >
                          {fmtTl(r.cumulativeNet)}
                        </td>
                        <td className="px-2 py-2 text-right tabular-nums text-sky-200/90">
                          {fmtTl(r.mrr)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-white/[0.06] font-semibold">
                      <td className="px-2 py-2.5 text-left text-zinc-100" colSpan={2}>
                        Yıl
                      </td>
                      <td className="px-2 py-2.5 text-right tabular-nums">{year.customers}</td>
                      <td className="px-2 py-2.5 text-right tabular-nums">{year.customers}</td>
                      <td className="px-2 py-2.5 text-right tabular-nums">
                        {fmtTl(year.setup)}
                      </td>
                      <td className="px-2 py-2.5 text-right tabular-nums">
                        {fmtTl(year.license)}
                      </td>
                      <td className="px-2 py-2.5 text-right tabular-nums">
                        {fmtTl(year.model)}
                      </td>
                      <td className="px-2 py-2.5 text-right tabular-nums text-sky-200">
                        {fmtTl(year.gross)}
                      </td>
                      <td className="px-2 py-2.5 text-right tabular-nums text-zinc-400">
                        {fmtTl(year.opex)}
                      </td>
                      <td className="px-2 py-2.5 text-right tabular-nums text-emerald-400">
                        {fmtTl(year.ebitda)}
                      </td>
                      <td className="px-2 py-2.5 text-right tabular-nums text-emerald-400">
                        {fmtTl(year.ebitda)}
                      </td>
                      <td className="px-2 py-2.5 text-right tabular-nums text-sky-200">
                        {fmtTl(year.exitMrr)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : null}
        </AccordionCard>
      ))}

      <p className="px-1 pt-2 text-xs leading-relaxed text-zinc-600">
        {PROJECTION_META.note}
      </p>
    </div>
  );
}
