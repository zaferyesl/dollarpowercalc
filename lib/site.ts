/** Production canonical URL — all SEO, sitemap, and internal links assume this domain. */
export const SITE_URL = "https://dollarpowercalc.com" as const;

export const SITE_NAME = "WealthTrace";
export const SITE_TAGLINE =
  "US-centric financial calculators for inflation impact, dividends, and building wealth.";
export const LOCALE_TAG = "en-US";
export const CURRENCY_CODE = "USD";
export const CURRENCY_DISPLAY = "$";

/** Google Analytics 4 measurement ID (override with NEXT_PUBLIC_GA_MEASUREMENT_ID on Vercel if needed). */
export const GA_MEASUREMENT_ID =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()) ||
  "G-2TCSZD18Z0";
