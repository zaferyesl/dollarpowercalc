import type { Metadata } from "next";

import { DividendSnowballClient } from "@/components/calculators/dividend/dividend-snowball-client";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site";

export const revalidate = 86_400;

const pagePath = "/calculators/dividend-snowball";
const canonicalUrl = `${SITE_URL}${pagePath}`;

export const metadata: Metadata = {
  title: "Dividend Snowball Calculator — DRIP & growth table",
  description:
    "Project dividend reinvestment stacks with mock yield presets (no outbound API spend), responsive tables, and sticky AdSense-ready rails.",
  keywords: ["dividend calculator", "DRIP calculator", "dividend growth", "compound dividends", "ETF dividends"],
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    url: canonicalUrl,
    title: "Dividend snowball calculator · WealthTrace",
    description: "Forecast ending balances with reinvestment toggles, yield growth, and capital appreciation sliders.",
    type: "article",
  },
};

export default function DividendSnowballPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${canonicalUrl}#app`,
        name: "Dividend snowball calculator",
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
        "@type": "CompoundPriceSpecification",
        "@id": `${canonicalUrl}#compound-price`,
        name: "Dividend-plus-contribution accumulation",
        priceCurrency: "USD",
        description:
          "Illustrates how recurring USD contributions compound with hypothetical dividend payouts and NAV growth sliders.",
      },
      {
        "@type": "FinancialValue",
        name: "Estimated portfolio balance USD",
        valueReference: `${canonicalUrl}#compound-price`,
        description:
          "Projection output displayed in formatted USD amounts for illustrative education—not performance guarantees.",
      },
    ],
  };

  return (
    <>
      <JsonLd data={structuredData} />
      <DividendSnowballClient />
    </>
  );
}
