"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { AdSlot } from "@/components/ads/ad-slot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { inflationAdjustedSalary, purchasingPowerToday } from "@/lib/math-engine";
import { formatUsd } from "@/lib/format";
import type { CpiResolution } from "@/lib/data/fred-cpi";

import type { InflationValuePoint } from "./inflation-value-chart";
import { useYearField } from "./use-year-field";

type Props = {
  yearlyIndexByYear: Record<number, number>;
  source: CpiResolution["source"];
};

const AnimatedChart = dynamic(
  async () =>
    import("./inflation-value-chart").then((mod) => ({ default: mod.InflationValueChart })),
  { ssr: false, loading: () => <SkeletonChart /> },
);

function SkeletonChart() {
  return (
    <div
      aria-hidden
      className="h-[260px] w-full animate-pulse rounded-xl border border-border/70 bg-muted/40 sm:h-[300px]"
    />
  );
}

export function InflationCalculatorClient({ yearlyIndexByYear, source }: Props) {
  const years = useMemo(
    () => Object.keys(yearlyIndexByYear).map((y) => Number.parseInt(y, 10)).sort((a, b) => a - b),
    [yearlyIndexByYear],
  );
  const minYear = years[0] ?? 1947;
  const latestIndexYear = years[years.length - 1] ?? new Date().getFullYear();

  const [activeTab, setActiveTab] = useState("buying-power");

  const [cashAmountUsd, setCashAmountUsd] = useState<number>(100);
  const buyingYearField = useYearField(1980, minYear, latestIndexYear);
  const referenceYear = buyingYearField.effectiveYear;

  const [salaryUsd, setSalaryUsd] = useState<number>(55_000);
  const salaryYearField = useYearField(2014, minYear, latestIndexYear);
  const salaryBaselineYear = salaryYearField.effectiveYear;

  const buyingPowerSummary = useMemo(() => {
    return purchasingPowerToday({
      amount: cashAmountUsd,
      indexStartYear: referenceYear,
      indexEndYear: latestIndexYear,
      yearlyIndexByYear,
    });
  }, [cashAmountUsd, referenceYear, yearlyIndexByYear, latestIndexYear]);

  const salarySummary = useMemo(() => {
    return inflationAdjustedSalary({
      salaryUsd,
      pastYear: salaryBaselineYear,
      currentYear: latestIndexYear,
      yearlyIndexByYear,
    });
  }, [salaryUsd, salaryBaselineYear, yearlyIndexByYear, latestIndexYear]);

  const nominalStackTimeline: InflationValuePoint[] = useMemo(() => {
    const start = referenceYear;
    const cpiBase = yearlyIndexByYear[start];
    if (!(typeof cpiBase === "number") || !(cpiBase > 0)) return [];

    const sliceYears = years.filter((year) => year >= start && year <= latestIndexYear);
    return sliceYears.map((year) => {
      const cpiYear = yearlyIndexByYear[year];
      const level = typeof cpiYear === "number" && cpiYear > 0 ? cpiYear : yearlyIndexByYear[latestIndexYear]!;
      return {
        year,
        nominalValueUsd: cashAmountUsd * (level / cpiBase),
      };
    });
  }, [cashAmountUsd, referenceYear, years, yearlyIndexByYear, latestIndexYear]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:pb-28">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-success">Calculators · Tools</p>
            <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.85rem]">
              Inflation & buying power
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
              CPI-U calibrated insights with once-per-day data refresh plus offline-safe anchors — built for evergreen
              US search intent.
            </p>
          </div>
          <motion.div layout className="rounded-3xl bg-muted/55 px-4 py-4 text-[0.7rem] text-muted-foreground sm:text-xs">
            <p className="font-semibold text-foreground">Data source</p>
            <p className="mt-2">
              CPI series: CPIAUCSL (via FRED) when `FRED_API_KEY` exists, stitched with interpolated anchors (
              {source}). Display year cap:{" "}
              <span className="font-semibold text-foreground">{latestIndexYear}</span>.
            </p>
          </motion.div>
        </div>

        <motion.div layout className="flex flex-wrap gap-2 text-[0.7rem] text-muted-foreground sm:text-xs">
          <span className="rounded-full border border-success/70 bg-success/15 px-3 py-1 font-semibold uppercase tracking-[0.2em] text-success">
            USD only
          </span>
          <span className="rounded-full bg-muted px-3 py-1 font-semibold uppercase tracking-[0.2em]">
            English (US)
          </span>
        </motion.div>
      </motion.div>

      <motion.div layout className="space-y-6 pt-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full gap-6">
          <TabsList className="grid grid-cols-2 rounded-3xl bg-muted/60 px-4 py-2 text-sm lg:w-[420px]">
            <TabsTrigger value="buying-power">Buying power</TabsTrigger>
            <TabsTrigger value="salary">Salary adjuster</TabsTrigger>
          </TabsList>

          <TabsContent value="buying-power">
            <Card className="border-border/75 bg-background/96 shadow-xl shadow-primary/20">
              <CardHeader className="space-y-2">
                <CardTitle>$100 yesterday → USD today?</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Price level math from your reference vintage year straight into {latestIndexYear} CPI terms.
                </p>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div className="grid gap-6 sm:grid-cols-[minmax(0,260px)_minmax(0,260px)]">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Nominal USD (historic face value)</Label>
                    <Input
                      id="amount"
                      inputMode="decimal"
                      min={1}
                      value={cashAmountUsd}
                      onChange={(e) =>
                        setCashAmountUsd(coerceNumberPositive(e.target.value, cashAmountUsd))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reference-year">Reference year</Label>
                    <Input
                      id="reference-year"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      spellCheck={false}
                      maxLength={4}
                      placeholder={`${minYear}–${latestIndexYear}`}
                      className="font-mono tabular-nums"
                      value={buyingYearField.text}
                      onChange={(e) => buyingYearField.onChange(e.target.value)}
                      onBlur={buyingYearField.onBlur}
                    />
                    <p className="text-xs text-muted-foreground">
                      Available CPI window {minYear} — {latestIndexYear}.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="salary">
            <Card className="border-border/75 shadow-xl shadow-success/35">
              <CardHeader className="space-y-2">
                <CardTitle>Lifestyle-preserving paycheck</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Converts a nominal salary while holding purchasing power anchored to CPI-U deltas.
                </p>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="salary-usd">Past salary ($)</Label>
                  <Input
                    id="salary-usd"
                    type="number"
                    inputMode="decimal"
                    value={salaryUsd}
                    onChange={(e) => setSalaryUsd(coerceNumberPositive(e.target.value, salaryUsd))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="baseline-year">Baseline calendar year</Label>
                  <Input
                    id="baseline-year"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={4}
                    placeholder={`${minYear}–${latestIndexYear}`}
                    className="font-mono tabular-nums"
                    value={salaryYearField.text}
                    onChange={(e) => salaryYearField.onChange(e.target.value)}
                    onBlur={salaryYearField.onBlur}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <motion.div layout>
            <AdSlot slotHint="inflation_below_form_primary" />
          </motion.div>

          <div className="grid gap-8 lg:[grid-template-columns:minmax(0,3fr)_minmax(0,290px)]">
            <motion.div layout className="flex min-w-0 flex-col gap-6">
              <Card className="border-border/80 bg-muted/40">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  {activeTab === "buying-power" ? (
                    <motion.div layout className="grid gap-4 sm:grid-cols-3">
                      <SummaryStat
                        eyebrow={`${referenceYear} → ${latestIndexYear}`}
                        label="Today's equivalent USD"
                        value={formatUsd(buyingPowerSummary.equivalentAmount)}
                      />
                      <SummaryStat
                        eyebrow="CPI uplift"
                        label="Purchasing multiplier"
                        value={`${buyingPowerSummary.ratio.toFixed(2)}×`}
                      />
                      <SummaryStat
                        eyebrow="Interpretation"
                        label="Rule of thumb"
                        value="Nominal cash must scale with CPI to keep everyday spending familiar."
                      />
                    </motion.div>
                  ) : (
                    <motion.div layout className="grid gap-4 sm:grid-cols-3">
                      <SummaryStat
                        eyebrow={`${salaryBaselineYear} → ${latestIndexYear}`}
                        label="Lifestyle-aligned salary ($)"
                        value={formatUsd(salarySummary)}
                      />
                      <SummaryStat
                        eyebrow="Growth vs baseline"
                        label="Delta"
                        value={formatUsd(salarySummary - salaryUsd)}
                      />
                      <SummaryStat
                        eyebrow="Labor nuance"
                        label="Reminder"
                        value="CPI tracks price baskets — real negotiations depend on equity, locality, perks."
                      />
                    </motion.div>
                  )}
                  <motion.div layout className="rounded-3xl border border-primary/35 bg-background/95 p-[1px] shadow-inner shadow-primary/20">
                    <div className="rounded-[calc(1.46rem_-1px)] bg-gradient-to-br from-success/55 via-transparent to-transparent p-[1px]">
                      <div className="rounded-[calc(1.42rem_-1px)] bg-card p-6">
                        {activeTab === "buying-power" ? (
                          <AnimatedChart referenceYear={referenceYear} data={nominalStackTimeline} />
                        ) : (
                          <div className="rounded-3xl bg-muted px-6 py-10 text-sm text-muted-foreground">
                            Switch back to Buying power tab to visualize the CPI escalation chart for nominal stacks —
                            Salary mode focuses purely on CPI-adjusted income parity.
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="hidden min-w-[260px] lg:flex lg:flex-col lg:gap-8">
              <div className="lg:sticky lg:top-36">
                <AdSlot slotHint="inflation_results_rail_primary" />
              </div>
            </div>
          </div>
        </Tabs>
      </motion.div>

      <div className="pt-16 lg:hidden">
        <AdSlot slotHint="inflation_results_below_chart_mobile" />
      </div>
    </div>
  );
}

function SummaryStat({ eyebrow, label, value }: { eyebrow: string; label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-background px-6 py-4 shadow-inner">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-success">{eyebrow}</p>
      <p className="mt-4 text-[0.7rem] text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold text-foreground sm:text-[1.4rem]">{value}</p>
    </div>
  );
}

function coerceNumberPositive(raw: string, fallback: number) {
  const n = Number.parseFloat(raw.replace(/[$,]/g, ""));
  if (!Number.isFinite(n) || n < 1) return fallback;
  return n;
}
