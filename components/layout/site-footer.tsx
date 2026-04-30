import Link from "next/link";

import { SITE_NAME, SITE_URL } from "@/lib/site";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/tools/inflation-calculator-by-year", label: "Inflation calculator by year" },
  { href: "/calculators/dividend-snowball", label: "Dividend snowball" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-muted/35">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold tracking-tight">{SITE_NAME}</p>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            Practical US-focused calculators powered by CPI insights and disciplined compounding visuals.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Canonical URL: {" "}
            <a href={SITE_URL} className="font-medium text-foreground underline underline-offset-2">
              {SITE_URL.replace("https://", "")}
            </a>
          </p>
        </div>
        <div className="grid gap-3 text-sm">
          <p className="font-semibold text-foreground">Calculators</p>
          <ul className="space-y-2 text-muted-foreground">
            {links.map((link) => (
              <li key={link.href}>
                <Link className="font-medium underline-offset-4 hover:text-foreground hover:underline" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-6xl gap-4 border-t border-border/70 px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:grid-cols-2 lg:gap-12">
        <span>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</span>
        <span className="lg:text-end">
          Educational calculators only—not financial advice. Past performance does not guarantee future results.
        </span>
      </div>
    </footer>
  );
}
