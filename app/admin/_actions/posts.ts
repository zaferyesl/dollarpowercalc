"use server";

import { auth } from "@/auth";
import { sanitizeBlogHtml } from "@/lib/sanitize-html-content";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slugify";
import type { BlogPostRow } from "@/types/blog";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";

async function assertAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

const BUCKET = "blog-covers";

function publishedAtFromForm(publishedRaw: FormDataEntryValue | null): string | null {
  if (typeof publishedRaw !== "string" || publishedRaw.trim() === "") return null;
  const d = new Date(publishedRaw);
  if (Number.isNaN(d.getTime())) {
    throw new Error("Invalid publish date — clear the field or pick a valid date/time.");
  }
  return d.toISOString();
}

function publicCoverUrl(key: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/${BUCKET}/${key}`;
}

async function uploadCoverFile(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
  const key = `${randomBytes(8).toString("hex")}.${safeExt}`;
  const supabase = createAdminSupabaseClient();
  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(BUCKET).upload(key, buf, {
    contentType: file.type || `image/${safeExt === "jpg" ? "jpeg" : safeExt}`,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return publicCoverUrl(key);
}

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  const supabase = createAdminSupabaseClient();
  let candidate = base;
  for (let i = 0; i < 20; i += 1) {
    const q = supabase.from("posts").select("id").eq("slug", candidate).maybeSingle();
    const { data } = await q;
    if (!data || data.id === excludeId) return candidate;
    candidate = `${base}-${randomBytes(2).toString("hex")}`;
  }
  throw new Error("Could not allocate unique slug");
}

export async function listAllPostsAdmin(): Promise<BlogPostRow[]> {
  await assertAdmin();
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.from("posts").select("*").order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as BlogPostRow[];
}

export async function getPostByIdAdmin(id: string): Promise<BlogPostRow | null> {
  await assertAdmin();
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as BlogPostRow | null;
}

export async function createPost(formData: FormData) {
  await assertAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title required");

  const slugRaw = String(formData.get("slug") ?? "").trim();
  const baseSlug = slugRaw ? slugify(slugRaw) : slugify(title);
  const slug = await ensureUniqueSlug(baseSlug);

  const description = String(formData.get("description") ?? "").trim() || null;
  const tagsRaw = String(formData.get("tags") ?? "").trim();
  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const contentRaw = String(formData.get("content") ?? "");
  const content = sanitizeBlogHtml(contentRaw);

  const published_at = publishedAtFromForm(formData.get("published_at"));

  const coverFile = formData.get("cover") as File | null;
  let cover_image: string | null = null;
  if (coverFile && coverFile.size > 0) {
    cover_image = await uploadCoverFile(coverFile);
  } else {
    const existingUrl = String(formData.get("cover_image_url") ?? "").trim();
    cover_image = existingUrl.length > 0 ? existingUrl : null;
  }

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      slug,
      content,
      description,
      tags,
      cover_image,
      published_at,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/blog");
  revalidatePath("/admin");
  return { ok: true as const, id: data!.id as string };
}

export async function updatePost(id: string, formData: FormData) {
  await assertAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title required");

  const oldSlug = String(formData.get("old_slug") ?? "").trim();

  const slugRaw = String(formData.get("slug") ?? "").trim();
  const baseSlug = slugify(slugRaw || title);
  const slug = await ensureUniqueSlug(baseSlug, id);

  const description = String(formData.get("description") ?? "").trim() || null;
  const tagsRaw = String(formData.get("tags") ?? "").trim();
  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const contentRaw = String(formData.get("content") ?? "");
  const content = sanitizeBlogHtml(contentRaw);

  const published_at = publishedAtFromForm(formData.get("published_at"));

  const coverFile = formData.get("cover") as File | null;
  let cover_image = String(formData.get("cover_image_url") ?? "").trim() || null;
  if (coverFile && coverFile.size > 0) {
    cover_image = await uploadCoverFile(coverFile);
  }

  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("posts")
    .update({
      title,
      slug,
      content,
      description,
      tags,
      cover_image,
      published_at,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  if (oldSlug && oldSlug !== slug) {
    revalidatePath(`/blog/${oldSlug}`);
  }
  revalidatePath("/admin");
  return { ok: true as const };
}

export async function deletePost(id: string) {
  await assertAdmin();
  const supabase = createAdminSupabaseClient();
  const { data: row } = await supabase.from("posts").select("slug").eq("id", id).maybeSingle();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/blog");
  if (row?.slug) revalidatePath(`/blog/${row.slug}`);
  revalidatePath("/admin");
  return { ok: true as const };
}

/** Upload only (e.g. inline images in editor — future); returns public URL. */
export async function uploadCoverFromForm(formData: FormData) {
  await assertAdmin();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("No file");
  const url = await uploadCoverFile(file);
  return { url };
}
