"use client";

import { motion } from "framer-motion";
import {
  BadgePercentIcon,
  LineChartIcon,
  PiggyBankIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function LandingBento() {
  return (
    <motion.section
      className="relative mx-auto mt-16 w-full max-w-6xl overflow-hidden px-4 pb-6 sm:px-6 lg:pb-24"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <div aria-hidden className="pointer-events-none absolute -left-10 top-[-16%] h-96 w-[120%] max-w-none rounded-[40%] bg-gradient-to-br from-primary/22 via-transparent to-success/22 blur-[90px]" />
      <motion.div variants={fadeUp}>
        <div className="flex flex-wrap items-start justify-between gap-6 lg:gap-12">
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full px-4 py-1 text-[0.7rem]" variant="outline">
                <SparklesIcon className="mr-1 h-4 w-4" aria-hidden />
                US calculators · USD-focused
              </Badge>
              <Badge className="rounded-full px-4 py-1 text-[0.7rem] bg-success text-success-foreground">
                CPI-aware inflation engine
              </Badge>
            </div>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {SITE_NAME}
              <span className="mx-3 font-medium text-muted-foreground sm:text-[2.85rem]">|</span>
              Wealth intelligence for modern US portfolios
            </h1>
            <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
              {SITE_TAGLINE} Built for mobile-first dashboards, ISR-cached CPI series, and
              conversion-friendly calculator flows on{" "}
              <span className="font-medium text-foreground">{SITE_URL.replace("https://", "")}</span>
              .
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full rounded-2xl text-base shadow-sm sm:w-auto",
                )}
                href="/tools/inflation-calculator-by-year"
              >
                Start inflation check
              </Link>
              <Link
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full rounded-2xl text-base shadow-sm backdrop-blur sm:w-auto",
                )}
                href="/calculators/dividend-snowball"
              >
                Visualize dividends
              </Link>
            </div>
          </div>
          <motion.div
            variants={fadeUp}
            className="relative w-full max-w-md shrink-0 overflow-hidden rounded-3xl border border-border/70 bg-background/95 p-[1px] shadow-[0_18px_40px_-12px_rgba(15,98,253,0.45)] lg:sticky lg:top-28 lg:self-start"
          >
            <div className="rounded-[calc(1.45rem)] bg-gradient-to-b from-success/55 via-transparent to-transparent p-[1px]">
              <div className="relative overflow-hidden rounded-[calc(1.45rem_-_1px)] bg-card px-8 py-8">
                <div className="absolute inset-x-[-30%] top-[-12%] h-52 rounded-full bg-primary/35 blur-[60px]" />
                <dl className="relative space-y-5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/90 text-primary-foreground shadow-inner">
                      <LineChartIcon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        CPI refresh
                      </dt>
                      <dd className="text-base font-semibold text-card-foreground">Once per day (ISR)</dd>
                      <span className="text-xs font-medium text-muted-foreground">
                        St. Louis Fed + resilient offline anchors.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-t border-dashed border-border/70 pt-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-success/95 text-success-foreground shadow-inner">
                      <BadgePercentIcon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Monetization-ready
                      </dt>
                      <dd className="text-base font-semibold text-card-foreground">Sticky sidebars · Ad placeholders</dd>
                      <span className="text-xs font-medium text-muted-foreground">
                        Optimized grids for CPC without blocking Core Web Vitals.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-t border-dashed border-border/70 pt-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-foreground">
                      <PiggyBankIcon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Mobile fidelity
                      </dt>
                      <dd className="text-base font-semibold text-card-foreground">Responsive tables & charts</dd>
                      <span className="text-xs font-medium text-muted-foreground">
                        Readable inputs, tactile motion, WCAG-aligned contrast.
                      </span>
                    </div>
                  </div>
                </dl>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:gap-7">
        <motion.div variants={fadeUp}>
          <Card className="h-full border-border/75 bg-muted/35 shadow-xl shadow-primary/25 transition hover:border-primary">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl sm:text-2xl">Buying power rewind</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                What was yesterday&apos;s paycheck worth once inflation is priced in today?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-2xl bg-background px-6 py-4 text-muted-foreground shadow-inner shadow-primary/35">
                <p className="text-xs uppercase tracking-[0.3em] text-success">Historical CPI trajectory</p>
                <ul className="mt-4 space-y-2">
                  <li>• CPI-U powered purchasing power deltas</li>
                  <li>• Salary normalization for lifestyle parity</li>
                  <li>• Chart tuned for readability on mobile</li>
                </ul>
              </div>
              <Link href="/tools/inflation-calculator-by-year" className={cn(buttonVariants(), "rounded-2xl")}>
                Open inflation workspace
              </Link>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Card className="h-full border-border/75 shadow-xl shadow-success/35 transition hover:border-success/80">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl sm:text-2xl">Dividend snowball cockpit</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Stack reinvestments, growth, and payouts with a tactile projection grid.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-2xl bg-background px-6 py-4 shadow-inner shadow-success/25">
                <p className="text-xs uppercase tracking-[0.3em] text-primary">DRIP aware</p>
                <ul className="mt-4 space-y-2">
                  <li>• Year-by-year portfolio trail</li>
                  <li>• Mock dividend presets (no third-party API spend)</li>
                  <li>• Results panel + ad slot layout</li>
                </ul>
              </div>
              <Link
                href="/calculators/dividend-snowball"
                className={cn(buttonVariants({ variant: "secondary" }), "rounded-2xl")}
              >
                Launch dividend snowball
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}
