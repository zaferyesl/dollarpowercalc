"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { createPost, updatePost } from "@/app/admin/_actions/posts";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/ui/button";
import { slugify } from "@/lib/slugify";
import { cn } from "@/lib/utils";
import type { BlogPostRow } from "@/types/blog";

type Props = {
  mode: "create" | "edit";
  post?: BlogPostRow;
};

export function PostEditorForm({ mode, post }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [description, setDescription] = useState(post?.description ?? "");
  const [tags, setTags] = useState((post?.tags ?? []).join(", "));
  const [publishedAt, setPublishedAt] = useState(
    post?.published_at ? toLocalInput(post.published_at) : "",
  );
  const [coverUrl, setCoverUrl] = useState(post?.cover_image ?? "");
  const [body, setBody] = useState(post?.content ?? "<p></p>");

  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
        <div>
          <CardTitle>{mode === "create" ? "New post" : "Edit post"}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Paste rich text from external sources — formatting is preserved where safe.
          </p>
        </div>
        <Link className={cn(buttonVariants({ variant: "outline", size: "sm" }))} href="/admin">
          Back
        </Link>
      </CardHeader>
      <CardContent className="space-y-6">
        {error ? (
          <div className="rounded-xl border border-destructive/60 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                const v = e.target.value;
                setTitle(v);
                if (mode === "create") setSlug(slugify(v));
              }}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              required
              className="font-mono text-sm"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">SEO description</Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Shown in search snippets and social previews."
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="investing, FIRE, inflation"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="published_at">Publish at</Label>
            <Input
              id="published_at"
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Leave empty for draft (hidden from public blog).</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cover">Cover image upload</Label>
          <Input
            ref={coverRef}
            id="cover"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
          />
          <div className="space-y-2 pt-2">
            <Label htmlFor="cover_image_url">Existing cover URL (optional)</Label>
            <Input
              id="cover_image_url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Body</Label>
          <RichTextEditor key={post?.id ?? "new"} value={body} onChange={setBody} />
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                setError(null);
                try {
                  const fd = new FormData();
                  fd.set("title", title);
                  fd.set("slug", slug);
                  fd.set("description", description);
                  fd.set("tags", tags);
                  if (publishedAt) fd.set("published_at", publishedAt);
                  if (coverUrl) fd.set("cover_image_url", coverUrl);
                  fd.set("content", body);

                  const file = coverRef.current?.files?.[0];
                  if (file?.size) fd.set("cover", file);

                  if (mode === "create") {
                    const res = await createPost(fd);
                    router.push(`/admin/posts/${res.id}/edit`);
                    router.refresh();
                  } else if (post?.id) {
                    fd.set("old_slug", post.slug);
                    await updatePost(post.id, fd);
                    router.refresh();
                  }
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Save failed");
                }
              })
            }
          >
            {mode === "create" ? "Create" : "Save changes"}
          </Button>
          <Link className={cn(buttonVariants({ variant: "outline" }))} href="/admin">
            Cancel
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function toLocalInput(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
