import type { Metadata } from "next";

import { LandingBento } from "@/components/landing/landing-bento";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "WealthTrace Calculator Hub",
  description: SITE_TAGLINE,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    url: SITE_URL,
    title: `${SITE_NAME} | US financial calculators`,
    description: SITE_TAGLINE,
  },
};

export default function Home() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: "en-US",
        description: SITE_TAGLINE,
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.ico`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={graph} />
      <LandingBento />
    </>
  );
}
