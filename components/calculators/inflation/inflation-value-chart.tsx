"use client";

import {
  CartesianGrid,
  ResponsiveContainer,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
} from "recharts";

import { formatUsd } from "@/lib/format";

export type InflationValuePoint = {
  year: number;
  nominalValueUsd: number;
};

type Props = {
  data: InflationValuePoint[];
  referenceYear: number;
};

export function InflationValueChart({ data, referenceYear }: Props) {
  return (
    <div className="w-full min-w-0">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2 text-xs text-muted-foreground">
        <span className="font-semibold uppercase tracking-[0.32em] text-primary">Projection</span>
        <span className="text-[0.7rem] sm:text-xs">
          Nominal stack grows with CPI from {referenceYear} forward (same face amount).
        </span>
      </div>
      <div className="h-[260px] w-full min-w-0 sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="inflationArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.488 0.191 259.962)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="oklch(0.488 0.191 259.962)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="oklch(0.922 0 0)" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "oklch(0.556 0 0)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={70}
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
              cursor={{ strokeDasharray: "4 4" }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const value = payload[0]?.value as number;
                return (
                  <div className="rounded-xl border border-border/80 bg-background/95 px-3 py-2 text-xs shadow-lg shadow-primary/20">
                    <p className="font-semibold text-foreground">{label}</p>
                    <p className="text-muted-foreground">Nominal stack</p>
                    <p className="text-sm font-semibold text-primary">{formatUsd(value)}</p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="nominalValueUsd"
              stroke="oklch(0.488 0.191 259.962)"
              strokeWidth={2}
              fill="url(#inflationArea)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
