import { CURRENCY_CODE, LOCALE_TAG } from "@/lib/site";

export function formatUsd(
  amount: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(LOCALE_TAG, {
    style: "currency",
    currency: CURRENCY_CODE,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatPercent(
  decimal: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(LOCALE_TAG, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
    ...options,
  }).format(Number.isFinite(decimal) ? decimal : 0);
}
