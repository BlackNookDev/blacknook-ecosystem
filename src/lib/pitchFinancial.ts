/** Blacknook 1 yıllık finansal projeksiyon — birim ekonomi modeli */

import { BLACKNOOK_FINANCIAL_PROJECTION } from '@/lib/financialMetrics';

const F = BLACKNOOK_FINANCIAL_PROJECTION;

export const FX_USD = F.fxTryPerUsd;

export const UNIT = {
  currency: 'TL' as const,
  setup: F.unitEconomics.setupFeePerClient,
  licenseMrr: F.unitEconomics.monthlyPlatformLicensePerClient,
  modelMrr: F.unitEconomics.monthlySelfHostedModelPerClient,
  get retainerMrr() {
    return this.licenseMrr + this.modelMrr;
  },
  get acvYear1() {
    return this.setup + this.licenseMrr * 12 + this.modelMrr * 12;
  },
};

/** Aylık sabit OPEX kalemleri */
export const OPEX_LINES = [
  { label: 'Çekirdek ekip maaş (8 kişi)', monthly: F.monthlyOpex.operationalPayroll },
  {
    label: 'Bulut altyapısı (AWS kredileri / donanım)',
    monthly: F.monthlyOpex.cloudInfrastructureAwsCredits,
  },
  {
    label: 'Kendi model & compute işletimi',
    monthly: F.monthlyOpex.selfHostedComputeMaintenance,
  },
  {
    label: 'SaaS lisansları & geliştirici araçları',
    monthly: F.monthlyOpex.saasLicensesTools,
  },
  {
    label: 'Hukuk, mali müşavirlik & KVKK',
    monthly: F.monthlyOpex.legalAccountingKvkk,
  },
  {
    label: 'B2B satış, ziyaret & saha',
    monthly: F.monthlyOpex.salesTravelOnboarding,
  },
  {
    label: 'Acil durum & donanım yedek fonu',
    monthly: F.monthlyOpex.contingencyReserve,
  },
] as const;

export const OPEX_MONTHLY = F.monthlyOpex.totalMonthlyOpex;
export const OPEX_ANNUAL = F.monthlyOpex.totalAnnualOpex;

/**
 * Çeyreklik yeni müşteri: 6 / 10 / 14 / 20 (= 50)
 * Aylık dağılım → 270 müşteri-ay (lisans+model kümülatif brief ile uyumlu)
 */
export const NEW_CUSTOMERS_BY_MONTH = [
  3, 2, 1, // Q1 → 6
  5, 3, 2, // Q2 → 10
  7, 4, 3, // Q3 → 14
  10, 5, 5, // Q4 → 20
] as const;

export type MonthRow = {
  month: number;
  label: string;
  quarter: 1 | 2 | 3 | 4;
  newCustomers: number;
  activeCustomers: number;
  setupRevenue: number;
  licenseRevenue: number;
  modelRevenue: number;
  totalRevenue: number;
  opex: number;
  net: number;
  cumulativeNet: number;
  mrr: number;
};

export type QuarterSummary = {
  quarter: 1 | 2 | 3 | 4;
  months: string;
  newCustomers: number;
  cumulativeCustomers: number;
  setupRevenue: number;
  endMrr: number;
};

function quarterOf(month: number): 1 | 2 | 3 | 4 {
  return Math.ceil(month / 3) as 1 | 2 | 3 | 4;
}

export function buildMonthlyProjection(): MonthRow[] {
  const rows: MonthRow[] = [];
  let active = 0;
  let cumulativeNet = 0;

  for (let i = 0; i < 12; i++) {
    const month = i + 1;
    const neu = NEW_CUSTOMERS_BY_MONTH[i];
    active += neu;
    const setupRevenue = neu * UNIT.setup;
    const licenseRevenue = active * UNIT.licenseMrr;
    const modelRevenue = active * UNIT.modelMrr;
    const totalRevenue = setupRevenue + licenseRevenue + modelRevenue;
    const opex = OPEX_MONTHLY;
    const net = totalRevenue - opex;
    cumulativeNet += net;

    rows.push({
      month,
      label: `Ay ${month}`,
      quarter: quarterOf(month),
      newCustomers: neu,
      activeCustomers: active,
      setupRevenue,
      licenseRevenue,
      modelRevenue,
      totalRevenue,
      opex,
      net,
      cumulativeNet,
      mrr: active * UNIT.retainerMrr,
    });
  }

  return rows;
}

export function buildQuarterSummaries(rows: MonthRow[]): QuarterSummary[] {
  return ([1, 2, 3, 4] as const).map((q) => {
    const slice = rows.filter((r) => r.quarter === q);
    const last = slice[slice.length - 1];
    return {
      quarter: q,
      months: `${(q - 1) * 3 + 1}–${q * 3}. aylar`,
      newCustomers: slice.reduce((s, r) => s + r.newCustomers, 0),
      cumulativeCustomers: last.activeCustomers,
      setupRevenue: slice.reduce((s, r) => s + r.setupRevenue, 0),
      endMrr: last.mrr,
    };
  });
}

export type YearTotals = {
  customers: number;
  setup: number;
  license: number;
  model: number;
  gross: number;
  exitMrr: number;
  exitArr: number;
  opex: number;
  ebitda: number;
  marginPct: number;
  breakEvenMonth: number | null;
  breakEvenCumulativeMonth: number | null;
};

export function computeYearTotals(rows: MonthRow[]): YearTotals {
  const last = rows[rows.length - 1];
  const setup = rows.reduce((s, r) => s + r.setupRevenue, 0);
  const license = rows.reduce((s, r) => s + r.licenseRevenue, 0);
  const model = rows.reduce((s, r) => s + r.modelRevenue, 0);
  const gross = setup + license + model;
  const opex = OPEX_ANNUAL;
  const ebitda = gross - opex;
  const marginPct = gross > 0 ? (ebitda / gross) * 100 : 0;

  let breakEvenMonth: number | null = null;
  let breakEvenCumulativeMonth: number | null = null;
  for (const r of rows) {
    if (breakEvenMonth == null && r.net >= 0 && r.activeCustomers >= 3) {
      breakEvenMonth = r.month;
    }
    if (breakEvenCumulativeMonth == null && r.cumulativeNet >= 0) {
      breakEvenCumulativeMonth = r.month;
    }
  }

  return {
    customers: last.activeCustomers,
    setup,
    license,
    model,
    gross,
    exitMrr: last.mrr,
    exitArr: last.mrr * 12,
    opex,
    ebitda,
    marginPct,
    breakEvenMonth,
    breakEvenCumulativeMonth,
  };
}

export function fmtTl(n: number, compact = false): string {
  if (compact && Math.abs(n) >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}M ₺`;
  }
  return `${Math.round(n).toLocaleString('tr-TR')} ₺`;
}

export function fmtUsd(tl: number): string {
  const usd = tl / FX_USD;
  if (Math.abs(usd) >= 1_000) {
    return `~${Math.round(usd).toLocaleString('en-US')} USD`;
  }
  return `~${usd.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD`;
}

export const PROJECTION_META = {
  title: '1 yıllık finansal projeksiyon',
  subtitle: 'Birim ekonomi · OPEX · aylık P&L · çeyreklik büyüme',
  note: 'Model: kurulum 100.000 ₺ + aylık retainer 19.000 ₺ (lisans 15.000 + model 4.000). OPEX sabit 210.000 ₺/ay. Müşteri kazanımı çeyreklik hedeflere (6/10/14/20) göre aylık dağıtılmıştır; kümülatif retainer 270 müşteri-ay = 5.130.000 ₺. Self-hosted LLM marjı anlatımda; barındırma maliyeti AWS kredileriyle 0 varsayılmıştır.',
} as const;

export { BLACKNOOK_FINANCIAL_PROJECTION } from '@/lib/financialMetrics';
