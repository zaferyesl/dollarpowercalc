import { CPI_ANCHOR_PAIRS, yearlySeriesFromAnchors } from "@/lib/data/cpi-anchors";

const CPI_SERIES_ID = "CPIAUCSL";

type FredObservation = {
  date: string;
  value: string;
};

export type CpiResolution = {
  yearlyIndexByYear: Record<number, number>;
  source: "fred" | "fallback" | "fred_partial";
};

function decemberAnnualFromMonthly(observations: FredObservation[]): Record<number, number> {
  const byYearDecember: Record<number, number> = {};
  for (const obs of observations) {
    const [yyyy, mm] = obs.date.split("-");
    if (!yyyy || mm !== "12") continue;
    const v = Number.parseFloat(obs.value);
    const year = Number.parseInt(yyyy, 10);
    if (Number.isFinite(year) && Number.isFinite(v) && !(v <= 0)) {
      byYearDecember[year] = v;
    }
  }
  return byYearDecember;
}

function mergePreferred(
  base: Record<number, number>,
  overlay: Record<number, number>,
): Record<number, number> {
  return { ...base, ...overlay };
}

function getFredApiKey(): string | undefined {
  const k = process.env.FRED_API_KEY;
  return k && k.length > 0 ? k : undefined;
}

async function fetchFredObservationsMonthly(): Promise<Record<number, number> | null> {
  const apiKey = getFredApiKey();
  if (!apiKey) return null;

  const url = new URL("https://api.stlouisfed.org/fred/series/observations");
  url.searchParams.set("series_id", CPI_SERIES_ID);
  url.searchParams.set("file_type", "json");
  url.searchParams.set("observation_start", "1947-01-01");
  url.searchParams.set("frequency", "m");
  url.searchParams.set("api_key", apiKey);

  const res = await fetch(url.toString(), {
    next: { revalidate: 86_400 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return null;

  const json = (await res.json()) as { observations?: FredObservation[] };
  const observations = json.observations;
  if (!Array.isArray(observations) || observations.length === 0) return null;

  return decemberAnnualFromMonthly(observations);
}

/**
 * Yearly CPI index map with ISR-backed Fred fetch merged over interpolated anchors fallback.
 */
export async function loadCpiYearlyIndex(options?: {
  maxYear?: number;
}): Promise<CpiResolution> {
  const maxYear =
    typeof options?.maxYear === "number" && Number.isFinite(options?.maxYear)
      ? Math.floor(options.maxYear!)
      : new Date().getFullYear();

  const fallbackRaw = yearlySeriesFromAnchors(CPI_ANCHOR_PAIRS);
  /** Clip interpolated keys to sane range */
  const fallback: Record<number, number> = {};
  Object.keys(fallbackRaw).forEach((k) => {
    const y = Number.parseInt(k, 10);
    if (y <= maxYear) fallback[y] = fallbackRaw[y]!;
  });

  try {
    const fredAnnual = await fetchFredObservationsMonthly();
    if (!fredAnnual) {
      return { yearlyIndexByYear: fallback, source: "fallback" };
    }

    /** Fred may miss recent December readings — interpolated anchors smooth edge years. */
    const merged = mergePreferred(fallback, fredAnnual);
    const numericYears = Object.keys(merged)
      .map((k) => Number.parseInt(k, 10))
      .sort((a, b) => a - b);

    const lastKnownYear = numericYears[numericYears.length - 1];
    const lastIndex = merged[lastKnownYear]!;

    for (let y = lastKnownYear + 1; y <= maxYear; y += 1) {
      merged[y] = lastIndex;
    }

    const source =
      Object.keys(fredAnnual).length > 0 ? "fred" : "fallback";

    return {
      yearlyIndexByYear: merged,
      source,
    };
  } catch {
    return { yearlyIndexByYear: fallback, source: "fallback" };
  }
}
