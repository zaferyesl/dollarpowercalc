import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type Props = HTMLAttributes<HTMLElement> & {
  label?: string;
  /** Semantic hint for eventual AdSense `data-ad-slot` wiring. */
  slotHint?: string;
};

/**
 * Non-blocking advertisement placeholder slot (loads no third-party scripts in MVP).
 * Replace inner markup with Google's AdSense snippet when approved.
 */
export function AdSlot({ className, label = "Advertisement", slotHint, ...rest }: Props) {
  return (
    <aside
      {...rest}
      aria-label={label}
      className={cn(
        "rounded-2xl border border-dashed border-border/70 bg-muted/40 p-4 text-center shadow-sm",
        className,
      )}
    >
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <div className="mx-auto mt-3 flex min-h-[100px] w-full max-w-[320px] flex-col justify-center rounded-xl bg-background/70 px-4 py-6 text-sm leading-relaxed text-muted-foreground">
        <span>AdSense placeholder reserved for unobtrusive CPC placement.</span>
        {slotHint ? (
          <span className="mt-3 font-mono text-xs text-muted-foreground/70">
            {`data-ad-slot="${slotHint}"`}
          </span>
        ) : null}
      </div>
    </aside>
  );
}
