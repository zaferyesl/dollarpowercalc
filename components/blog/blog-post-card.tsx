import Image from "next/image";
import Link from "next/link";

import type { BlogPostCard } from "@/types/blog";

type Props = {
  post: BlogPostCard;
};

export function BlogPostCard({ post }: Props) {
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm transition hover:border-primary/40 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/15 to-success/25 text-sm font-medium text-muted-foreground">
            WealthTrace Weekly
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        {date ? (
          <time className="text-xs font-semibold uppercase tracking-[0.28em] text-success" dateTime={post.published_at!}>
            {date}
          </time>
        ) : null}
        <h2 className="text-balance text-xl font-semibold tracking-tight transition group-hover:text-primary">
          {post.title}
        </h2>
        {post.description ? (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
        ) : null}
        {(post.tags ?? []).length > 0 ? (
          <div className="mt-auto flex flex-wrap gap-2">
            {(post.tags ?? []).slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-3 py-1 text-[0.68rem] font-medium uppercase tracking-wider text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
