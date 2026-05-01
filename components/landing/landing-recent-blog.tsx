import Link from "next/link";

import { BlogPostCard } from "@/components/blog/blog-post-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BlogPostCard as BlogPostCardData } from "@/types/blog";

type Props = {
  posts: BlogPostCardData[];
};

export function LandingRecentBlog({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section
      className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:pb-28"
      aria-labelledby="landing-recent-blog-heading"
    >
      <div className="flex flex-col gap-4 border-t border-border/60 pt-14 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-success">Blog</p>
          <h2
            id="landing-recent-blog-heading"
            className="mt-2 text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Latest articles
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            CPI context, income investing, and portfolio discipline — refreshed on the same cadence as the blog index.
          </p>
        </div>
        <Link href="/blog" className={cn(buttonVariants({ variant: "outline" }), "shrink-0 rounded-2xl self-start sm:self-auto")}>
          View all posts
        </Link>
      </div>

      <ul className="mt-10 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
        {posts.map((post) => (
          <li key={post.id} className="min-w-0">
            <BlogPostCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}
