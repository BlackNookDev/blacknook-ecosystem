/**
 * Blacknook finansal referans sabitleri — tek kaynak.
 * Pitch / dashboard / doküman bu dosyayı kullanır.
 */

export const BLACKNOOK_FINANCIAL_PROJECTION = {
  unitEconomics: {
    currency: 'TRY' as const,
    setupFeePerClient: 100_000,
    monthlyPlatformLicensePerClient: 15_000,
    monthlySelfHostedModelPerClient: 4_000,
    totalMonthlyRetainerPerClient: 19_000,
    firstYearAcvPerClient: 328_000,
  },
  monthlyOpex: {
    operationalPayroll: 150_000,
    cloudInfrastructureAwsCredits: 0,
    selfHostedComputeMaintenance: 15_000,
    saasLicensesTools: 10_000,
    legalAccountingKvkk: 10_000,
    salesTravelOnboarding: 15_000,
    contingencyReserve: 10_000,
    totalMonthlyOpex: 210_000,
    totalAnnualOpex: 2_520_000,
  },
  yearEndSummary: {
    targetClientsYearEnd: 50,
    cumulativeSetupRevenue: 5_000_000,
    cumulativeLicenseRevenue: 4_050_000,
    cumulativeModelRevenue: 1_080_000,
    totalGrossRevenue: 10_130_000,
    exitMrr: 950_000,
    exitArr: 11_400_000,
    netEbitda: 7_610_000,
    netProfitMargin: 75.1,
    breakEvenMonth: 2,
  },
  /** Yaklaşık USD çevirimi (brief: ~275k USD brüt) */
  fxTryPerUsd: 36.8,
} as const;

export type BlacknookFinancialProjection = typeof BLACKNOOK_FINANCIAL_PROJECTION;
