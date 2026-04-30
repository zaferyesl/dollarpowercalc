import Script from "next/script";

import { GA_MEASUREMENT_ID } from "@/lib/site";

/**
 * gtag.js — loaded once via root layout (one tag site-wide).
 * Equivalent to Google's snippet placed after `<head>`; uses `afterInteractive` per Next.js guidance.
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-gtag" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');
`}
      </Script>
    </>
  );
}
