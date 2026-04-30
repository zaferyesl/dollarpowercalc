"use client";

import {
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
} from "recharts";

import { formatUsd } from "@/lib/format";

type Point = {
  year: number;
  balanceUsd: number;
};

type Props = {
  data: Point[];
};

export function DividendGrowthChart({ data }: Props) {
  return (
    <div className="w-full min-w-0">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 text-xs text-muted-foreground">
        <span className="font-semibold uppercase tracking-[0.32em] text-primary">Growth curve</span>
        <span className="text-[0.72rem] text-muted-foreground">
          Ending balance after contributions, dividends, and NAV growth.
        </span>
      </div>
      <div className="h-[240px] w-full min-w-0 sm:h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 6, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="divGrowth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.641 0.166 154.957)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="oklch(0.641 0.166 154.957)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 8" vertical={false} stroke="oklch(0.922 0 0)" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={72}
              tickFormatter={(v) =>
                new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 1,
                }).format(v as number)
              }
              tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const balance = payload[0]?.payload as Point | undefined;
                if (!balance) return null;
                return (
                  <div className="rounded-xl border border-border/75 bg-background/95 px-3 py-2 text-xs shadow-xl shadow-success/25">
                    <p className="font-semibold text-foreground">Year {balance.year}</p>
                    <p className="text-muted-foreground">Projected portfolio</p>
                    <p className="text-sm font-semibold text-success">{formatUsd(balance.balanceUsd)}</p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="balanceUsd"
              stroke="oklch(0.641 0.166 154.957)"
              strokeWidth={2.4}
              fill="url(#divGrowth)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
