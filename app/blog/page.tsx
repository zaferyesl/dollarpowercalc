import type { Metadata } from "next";

import { fetchPublishedPostsPage } from "@/lib/actions/blog-public";
import { BlogInfiniteList } from "@/components/blog/blog-infinite-list";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Wealth intelligence blog",
  description: `${SITE_TAGLINE} Long-form explainers, CPI context, and dividend strategy notes.`,
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    url: `${SITE_URL}/blog`,
    title: `Blog | ${SITE_NAME}`,
    description: SITE_TAGLINE,
    type: "website",
  },
};

export default async function BlogIndexPage() {
  let initialPosts: Awaited<ReturnType<typeof fetchPublishedPostsPage>>["posts"] = [];
  let initialHasMore = false;
  let error: string | null = null;

  try {
    const res = await fetchPublishedPostsPage(0);
    initialPosts = res.posts;
    initialHasMore = res.hasMore;
  } catch {
    error = "Unable to load articles. Check Supabase environment variables.";
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <header className="max-w-3xl space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-success">Blog · Research</p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-[2.75rem]">
          Market context for modern US portfolios
        </h1>
        <p className="text-pretty text-base text-muted-foreground sm:text-lg">
          ISR-cached stories on inflation math, income investing, and disciplined compounding — refreshed often, built
          for mobile reading.
        </p>
      </header>
      <div className="mt-14">
        {error ? (
          <div className="rounded-3xl border border-destructive/50 bg-destructive/10 px-6 py-8 text-sm text-destructive">
            {error}
          </div>
        ) : (
          <BlogInfiniteList initialPosts={initialPosts} initialHasMore={initialHasMore} />
        )}
      </div>
    </section>
  );
}
