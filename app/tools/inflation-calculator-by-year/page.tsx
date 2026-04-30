import type { Metadata } from "next";

import { InflationCalculatorClient } from "@/components/calculators/inflation/inflation-calculator-client";
import { JsonLd } from "@/components/seo/json-ld";
import { loadCpiYearlyIndex } from "@/lib/data/fred-cpi";
import { SITE_URL } from "@/lib/site";

export const revalidate = 86_400;

const pagePath = "/tools/inflation-calculator-by-year";
const canonicalUrl = `${SITE_URL}${pagePath}`;

export const metadata: Metadata = {
  title: "Inflation Calculator by Year — CPI buying power & salary adjuster",
  description:
    "See what past US dollars are worth today using CPI-U calibrated math, salary lifestyle preservation, and ISR-cached St. Louis Fed data.",
  keywords: [
    "inflation calculator",
    "CPI calculator",
    "purchasing power",
    "salary inflation adjuster",
    "US inflation",
  ],
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    url: canonicalUrl,
    title: "Inflation calculator by year · WealthTrace",
    description:
      "Model historic dollar strength with CPI-backed math, mobile-friendly charts, and fast ISR data refresh.",
    type: "article",
  },
};

export default async function InflationCalculatorPage() {
  const { yearlyIndexByYear, source } = await loadCpiYearlyIndex();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${canonicalUrl}#app`,
        name: "Inflation calculator by year",
        url: canonicalUrl,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
      },
      {
        "@type": "FinancialValue",
        name: "Today's equivalent USD purchasing power",
        description:
          "Demonstrates how CPI index ratios translate nominal dollars into updated price-level terms.",
      },
    ],
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <InflationCalculatorClient yearlyIndexByYear={yearlyIndexByYear} source={source} />
    </>
  );
}
