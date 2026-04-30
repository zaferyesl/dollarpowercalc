import type { ReactNode } from "react";
import Link from "next/link";

import { adminLogoutAction } from "@/app/admin/_actions/logout";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminDashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[70vh] bg-muted/30">
      <div className="border-b border-border/80 bg-background">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex flex-wrap gap-6 text-sm font-medium">
            <Link className="text-foreground" href="/admin">
              Posts
            </Link>
            <Link
              href="/admin/posts/new"
              className={cn(buttonVariants({ size: "sm" }), "rounded-xl px-5")}
            >
              New post
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link className={buttonVariants({ variant: "ghost", size: "sm" })} href="/">
              Site
            </Link>
            <form action={adminLogoutAction}>
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10">{children}</div>
    </div>
  );
}
