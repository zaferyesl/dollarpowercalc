/**
 * Pure helpers for CPI-based inflation and compound wealth math.
 */

/** Employer elective deferral limit (combined pre-tax + Roth elective deferrals), IRS guidance 2024/2025. */
export const ELECTIVE_DEFERRAL_LIMIT_2025_USD = 23_500;

export function compoundGrowth({
  principal,
  annualRate,
  compoundingPerYear,
  years,
}: {
  principal: number;
  annualRate: number;
  compoundingPerYear: number;
  years: number;
}): number {
  const r = Number(annualRate);
  const n = Math.max(1, Math.round(compoundingPerYear));
  const t = Number(years);
  const P = Number(principal);
  if (!(P >= 0) || !(t >= 0) || !(n >= 1)) return 0;
  return P * Math.pow(1 + r / n, n * t);
}

/**
 * CPI index ratio: expresses how many times prices changed between two index readings.
 */
export function cpiRatio(indexStart: number, indexEnd: number): number {
  const start = Number(indexStart);
  const end = Number(indexEnd);
  if (!(start > 0) || !(end > 0)) return 1;
  return end / start;
}

/** What an amount denominated at `yearStart` is worth when priced at `yearEnd` CPI-U levels. */
export function purchasingPowerToday({
  amount,
  indexStartYear,
  indexEndYear,
  yearlyIndexByYear,
}: {
  amount: number;
  indexStartYear: number;
  indexEndYear: number;
  yearlyIndexByYear: Record<number, number>;
}): { equivalentAmount: number; ratio: number } {
  const i0 = yearlyIndexByYear[indexStartYear];
  const i1 = yearlyIndexByYear[indexEndYear];
  const ratio =
    typeof i0 === "number" && typeof i1 === "number"
      ? cpiRatio(i0, i1)
      : 1;
  return { equivalentAmount: amount * ratio, ratio };
}

/** Salary adjusted to preserve purchasing power from `pastYear` to `currentYear`. */
export function inflationAdjustedSalary({
  salaryUsd,
  pastYear,
  currentYear,
  yearlyIndexByYear,
}: {
  salaryUsd: number;
  pastYear: number;
  currentYear: number;
  yearlyIndexByYear: Record<number, number>;
}): number {
  const { equivalentAmount } = purchasingPowerToday({
    amount: salaryUsd,
    indexStartYear: pastYear,
    indexEndYear: currentYear,
    yearlyIndexByYear,
  });
  return equivalentAmount;
}

export function guardElectiveDeferral({
  electiveDeferralUsd,
  limitUsd = ELECTIVE_DEFERRAL_LIMIT_2025_USD,
}: {
  electiveDeferralUsd: number;
  limitUsd?: number;
}): { clampedDeferralUsd: number; capped: boolean } {
  const x = Number(electiveDeferralUsd);
  const cap = Number(limitUsd);
  if (!(x >= 0) || !(cap >= 0)) return { clampedDeferralUsd: 0, capped: false };
  if (x > cap) return { clampedDeferralUsd: cap, capped: true };
  return { clampedDeferralUsd: x, capped: false };
}

export type DividendSnowballInputs = {
  principalUsd: number;
  monthlyContributionUsd: number;
  annualDividendYield: number;
  dividendGrowthRateAnnual: number;
  priceGrowthRateAnnual: number;
  years: number;
  dripEnabled: boolean;
};

export type DividendSnowballYear = {
  year: number;
  balanceUsd: number;
  dividendsEarnedUsd: number;
};

/** Year-step snowball: annual contributions + yield on balance, DRIP toggle, NAV growth applied after payout. */
export function dividendSnowballSeries(
  inputs: DividendSnowballInputs,
): DividendSnowballYear[] {
  let balanceUsd = Math.max(0, Number(inputs.principalUsd));
  let yieldAnnual = Number(inputs.annualDividendYield);
  const divGrowth = Number(inputs.dividendGrowthRateAnnual);
  const priceGrowth = Number(inputs.priceGrowthRateAnnual);
  const monthlyContrib = Math.max(0, Number(inputs.monthlyContributionUsd));
  const drip = inputs.dripEnabled;
  const nYears = Math.max(0, Math.floor(Number(inputs.years)));

  const out: DividendSnowballYear[] = [];

  for (let y = 1; y <= nYears; y += 1) {
    balanceUsd += monthlyContrib * 12;
    const dividendsEarnedUsd = balanceUsd * yieldAnnual;
    if (drip) balanceUsd += dividendsEarnedUsd;
    balanceUsd *= 1 + priceGrowth;
    yieldAnnual *= 1 + divGrowth;
    out.push({
      year: y,
      balanceUsd,
      dividendsEarnedUsd,
    });
  }

  return out;
}
