"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { PiggyBankIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { AdSlot } from "@/components/ads/ad-slot";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MockDividendPreset, MOCK_DIVIDEND_PRESETS } from "@/lib/data/dividend-mock";
import { dividendSnowballSeries } from "@/lib/math-engine";
import { formatUsd } from "@/lib/format";

const GrowthChart = dynamic(
  async () =>
    import("./dividend-growth-chart").then((mod) => ({ default: mod.DividendGrowthChart })),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

function ChartSkeleton() {
  return (
    <div
      aria-hidden
      className="h-[240px] w-full animate-pulse rounded-xl border border-border/70 bg-muted/40 sm:h-[280px]"
    />
  );
}

export function DividendSnowballClient() {
  const [principal, setPrincipal] = useState(25_000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [dividendYieldPct, setDividendYieldPct] = useState(4.25);
  const [dividendGrowthPct, setDividendGrowthPct] = useState(3);
  const [priceGrowthPct, setPriceGrowthPct] = useState(6);
  const [years, setYears] = useState(20);
  const [drip, setDrip] = useState(true);

  const series = useMemo(() => {
    return dividendSnowballSeries({
      principalUsd: principal,
      monthlyContributionUsd: monthlyContribution,
      annualDividendYield: safePercent(dividendYieldPct),
      dividendGrowthRateAnnual: safePercent(dividendGrowthPct),
      priceGrowthRateAnnual: safePercent(priceGrowthPct),
      years,
      dripEnabled: drip,
    });
  }, [principal, monthlyContribution, dividendYieldPct, dividendGrowthPct, priceGrowthPct, years, drip]);

  const aggregate = useMemo(() => {
    if (!series.length) {
      return { totalDividends: 0, endingBalance: 0 };
    }
    const totalDividends = series.reduce((sum, row) => sum + row.dividendsEarnedUsd, 0);
    const endingBalance = series.at(-1)?.balanceUsd ?? 0;
    return { totalDividends, endingBalance };
  }, [series]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:pb-28">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-success">Compound · Income</p>
            <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.85rem]">
              Dividend snowball lab
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Model reinvested dividends with zero external API spend in MVP — swap the mock adapter for Alpha Vantage
              or Yahoo Finance when you are ready to stream live quotes.
            </p>
          </div>
          <motion.div
            layout
            className="flex items-center gap-3 rounded-3xl border border-success/50 bg-success/10 px-4 py-3 text-sm text-foreground"
          >
            <PiggyBankIcon className="h-6 w-6" aria-hidden />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-success">DRIP toggle</p>
              <p className="text-xs text-muted-foreground">Instantly compare cash vs compounding.</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:[grid-template-columns:minmax(0,2.2fr)_minmax(0,1fr)]">
        <Card className="border-border/80 bg-background/95 shadow-xl shadow-primary/30">
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
            <CardDescription>Percent fields use whole numbers (e.g., 4.25 = 4.25%).</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="principal"
                label="Starting balance ($)"
                value={principal}
                onChange={(v) => setPrincipal(clampPositive(v))}
              />
              <Field
                id="monthly"
                label="Monthly contributions ($)"
                value={monthlyContribution}
                onChange={(v) => setMonthlyContribution(clampPositive(v))}
              />
              <PercentField
                id="yield"
                label="Starting dividend yield (%)"
                value={dividendYieldPct}
                onChange={setDividendYieldPct}
              />
              <PercentField
                id="yield-growth"
                label="Dividend growth (annual %)"
                value={dividendGrowthPct}
                onChange={setDividendGrowthPct}
              />
              <PercentField
                id="price-growth"
                label="Price / NAV CAGR (annual %)"
                value={priceGrowthPct}
                onChange={setPriceGrowthPct}
              />
              <Field id="years" label="Years" value={years} onChange={(v) => setYears(clampYears(v))} />
            </div>
            <motion.div layout className="rounded-3xl border border-muted bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Mock inspirations</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {MOCK_DIVIDEND_PRESETS.map((preset: MockDividendPreset, index) => {
                  return (
                    <Button
                      type="button"
                      key={`${preset.symbol}-${index}`}
                      size="xs"
                      variant="outline"
                      className="rounded-full text-xs shadow-sm"
                      onClick={() =>
                        setDividendYieldPct(Number((preset.indicativeYieldPct * 100).toFixed(2)))
                      }
                    >
                      Load {preset.symbol} yield (~{ (preset.indicativeYieldPct * 100).toFixed(2) }%)
                    </Button>
                  );
                })}
              </div>
            </motion.div>
            <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3">
              <Checkbox
                id="drip"
                checked={drip}
                onCheckedChange={(state) => setDrip(state === true)}
              />
              <div>
                <Label htmlFor="drip" className="text-sm font-semibold text-foreground">
                  Reinvest dividends (DRIP)
                </Label>
                <p className="text-xs text-muted-foreground">
                  When off, dividends accrue on paper but are not added to principal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="border border-primary/25 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base">Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Ending balance</span>
                <span className="text-lg font-semibold text-foreground">{formatUsd(aggregate.endingBalance)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span>Cumulative dividends</span>
                <span className="text-lg font-semibold text-success">{formatUsd(aggregate.totalDividends)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <motion.div layout className="mt-8">
        <AdSlot slotHint="dividend_below_form" />
      </motion.div>

      <div className="mt-12 grid gap-8 lg:[grid-template-columns:minmax(0,2.3fr)_minmax(0,1fr)]">
        <Card className="border-border/80 bg-muted/30">
          <CardHeader>
            <CardTitle>Year-by-year trail</CardTitle>
            <CardDescription>Mobile cards avoid horizontal scroll; desktop keeps a compact grid.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <GrowthChart data={series.map((row) => ({ year: row.year, balanceUsd: row.balanceUsd }))} />
            <div className="hidden md:block">
              <div className="grid grid-cols-[0.5fr_1fr_1fr] gap-3 rounded-2xl bg-background px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                <span>Year</span>
                <span>Balance</span>
                <span>Dividends (year)</span>
              </div>
              <div className="mt-2 space-y-2">
                {series.map((row) => (
                  <div
                    key={row.year}
                    className="grid grid-cols-[0.5fr_1fr_1fr] gap-3 rounded-2xl border border-border/60 bg-background px-4 py-3 text-sm"
                  >
                    <span className="font-semibold text-foreground">{row.year}</span>
                    <span className="text-foreground">{formatUsd(row.balanceUsd)}</span>
                    <span className="text-success">{formatUsd(row.dividendsEarnedUsd)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3 md:hidden">
              {series.map((row) => (
                <div key={row.year} className="rounded-3xl border border-border/70 bg-background p-4 shadow-sm">
                  <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                    <span>Year {row.year}</span>
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Snapshot</span>
                  </div>
                  <dl className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <dt>Balance</dt>
                      <dd className="font-semibold text-foreground">{formatUsd(row.balanceUsd)}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt>Dividends</dt>
                      <dd className="font-semibold text-success">{formatUsd(row.dividendsEarnedUsd)}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="lg:hidden">
          <AdSlot slotHint="dividend_mobile_rail" />
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-36">
            <AdSlot slotHint="dividend_result_rail" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => {
          const next = Number.parseFloat(e.target.value);
          onChange(Number.isFinite(next) ? next : 0);
        }}
      />
    </div>
  );
}

function PercentField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        step="0.05"
        value={value}
        onChange={(e) => {
          const next = Number.parseFloat(e.target.value);
          onChange(Number.isFinite(next) ? next : 0);
        }}
      />
    </div>
  );
}

function safePercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return value / 100;
}

function clampPositive(value: number) {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function clampYears(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.min(60, Math.max(1, Math.floor(value)));
}
