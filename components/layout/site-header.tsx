import Link from "next/link";
import { LineChartIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const nav = [
  { href: "/tools/inflation-calculator-by-year", label: "Inflation" },
  { href: "/calculators/dividend-snowball", label: "Dividend Snowball" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link className="group flex items-center gap-3" href="/">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm ring ring-primary/25 transition group-hover:scale-[1.02]">
            <LineChartIcon className="h-5 w-5" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="flex items-baseline gap-2 text-base font-semibold tracking-tight sm:text-lg">
              {SITE_NAME}{" "}
              <span className="rounded-full bg-success/15 px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-wider text-success">
                US
              </span>
            </span>
            <span className="block text-[0.7rem] text-muted-foreground sm:text-xs">
              {SITE_URL.replace("https://", "")}
            </span>
          </span>
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap items-center gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
