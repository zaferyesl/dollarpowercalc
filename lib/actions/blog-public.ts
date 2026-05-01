"use server";

import { BLOG_PAGE_SIZE } from "@/lib/blog/constants";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { BlogPostCard, BlogPostRow } from "@/types/blog";

export async function fetchPublishedPostsPage(pageIndex: number): Promise<{
  posts: BlogPostCard[];
  hasMore: boolean;
}> {
  const from = Math.max(0, pageIndex) * BLOG_PAGE_SIZE;
  const to = from + BLOG_PAGE_SIZE - 1;
  const supabase = createPublicSupabaseClient();
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, description, tags, cover_image, published_at")
    .not("published_at", "is", null)
    .lte("published_at", nowIso)
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);
  const posts = (data ?? []).map((row) => ({
    ...row,
    tags: row.tags ?? [],
  })) as BlogPostCard[];

  return { posts, hasMore: posts.length === BLOG_PAGE_SIZE };
}

export async function fetchLatestPublishedPosts(limit: number): Promise<BlogPostCard[]> {
  const n = Math.min(Math.max(1, Math.floor(limit)), 24);
  const supabase = createPublicSupabaseClient();
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, description, tags, cover_image, published_at")
    .not("published_at", "is", null)
    .lte("published_at", nowIso)
    .order("published_at", { ascending: false })
    .limit(n);

  if (error) throw new Error(error.message);
  return ((data ?? []) as BlogPostCard[]).map((row) => ({
    ...row,
    tags: row.tags ?? [],
  }));
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPostRow | null> {
  const supabase = createPublicSupabaseClient();
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .not("published_at", "is", null)
    .lte("published_at", nowIso)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  const row = data as BlogPostRow;
  return { ...row, tags: row.tags ?? [] };
}
