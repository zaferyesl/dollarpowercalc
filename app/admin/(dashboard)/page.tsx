import Link from "next/link";
import type { Metadata } from "next";

import { DeletePostButton } from "@/components/admin/delete-post-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { listAllPostsAdmin } from "@/app/admin/_actions/posts";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin · Posts",
};

export default async function AdminPostsPage() {
  let rows: Awaited<ReturnType<typeof listAllPostsAdmin>> = [];
  let loadError: string | null = null;

  try {
    rows = await listAllPostsAdmin();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Could not load posts.";
  }

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle>Blog posts</CardTitle>
        <CardDescription>Manage drafts and published WealthTrace articles.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 pt-6">
        {loadError ? (
          <div className="rounded-2xl border border-destructive/50 bg-destructive/10 px-4 py-4 text-sm text-destructive">
            {loadError}&nbsp;
            Verify <code className="font-mono text-xs">.env</code> has Supabase URL, anon key, and service role
            key configured on Vercel.
          </div>
        ) : null}
        {!loadError && !rows?.length ? (
          <div className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
            No posts yet.&nbsp;
            <Link href="/admin/posts/new" className="font-semibold text-primary underline">
              Create one
            </Link>
          </div>
        ) : !loadError ? (
          <div className="space-y-3">
            {rows.map((post) => (
              <article
                key={post.id}
                className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border bg-background px-4 py-4"
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-lg font-semibold">{post.title}</h2>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                      {post.published_at ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">/{post.slug}</p>
                  {(post.tags?.length ?? 0) > 0 ? (
                    <p className="text-xs text-muted-foreground">Tags: {(post.tags ?? []).join(", ")}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    Edit
                  </Link>
                  {post.slug && post.published_at ? (
                    <Link
                      href={`/blog/${post.slug}`}
                      className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                    >
                      View
                    </Link>
                  ) : null}
                  <DeletePostButton id={post.id} title={post.title} />
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
