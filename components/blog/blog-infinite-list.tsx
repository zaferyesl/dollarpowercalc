"use client";

import { Loader2Icon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { fetchPublishedPostsPage } from "@/lib/actions/blog-public";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import type { BlogPostCard as BlogPostCardType } from "@/types/blog";

type Props = {
  initialPosts: BlogPostCardType[];
  initialHasMore: boolean;
};

export function BlogInfiniteList({ initialPosts, initialHasMore }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [busy, setBusy] = useState(false);
  const [observeEnabled, setObserveEnabled] = useState(false);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /** Avoid eager double-fetch when the sentinel is initially in view above the footer. */
    const t = setTimeout(() => setObserveEnabled(true), 750);
    return () => clearTimeout(t);
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingRef.current) return;
    loadingRef.current = true;
    setBusy(true);
    try {
      const next = page + 1;
      const { posts: nextPosts, hasMore: more } = await fetchPublishedPostsPage(next);
      setPage(next);
      setHasMore(more);
      setPosts((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const merged = [...prev];
        for (const p of nextPosts) {
          if (!ids.has(p.id)) merged.push(p);
        }
        return merged;
      });
    } catch {
      setHasMore(false);
    } finally {
      setBusy(false);
      loadingRef.current = false;
    }
  }, [hasMore, page]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || !observeEnabled) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        void loadMore();
      },
      { rootMargin: "240px" },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadMore, observeEnabled]);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
      <div ref={sentinelRef} className="col-span-full h-4 scroll-mt-96" aria-hidden />
      <div className="col-span-full flex min-h-[3rem] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
        {busy ? (
          <span className="flex items-center gap-2">
            <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden />
            Loading more…
          </span>
        ) : null}
        {!busy && posts.length === 0 ? <span>No published posts yet.</span> : null}
        {!busy && hasMore && posts.length > 0 ? (
          <button
            type="button"
            onClick={() => void loadMore()}
            className="rounded-full border border-border px-6 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Load more manually
          </button>
        ) : null}
        {!busy && !hasMore && posts.length > 0 ? <span>You’ve reached the end.</span> : null}
      </div>
    </div>
  );
}
