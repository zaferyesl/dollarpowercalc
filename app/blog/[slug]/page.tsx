import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { getPublishedPostBySlug } from "@/lib/actions/blog-public";
import { JsonLd } from "@/components/seo/json-ld";
import { sanitizeBlogHtml } from "@/lib/sanitize-html-content";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const supabase = createPublicSupabaseClient();
    const nowIso = new Date().toISOString();
    const { data } = await supabase
      .from("posts")
      .select("slug")
      .not("published_at", "is", null)
      .lte("published_at", nowIso);
    return (data ?? []).map((row: { slug: string }) => ({ slug: row.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;

  try {
    const post = await getPublishedPostBySlug(slug);
    if (!post) return { title: "Article not found | WealthTrace", robots: { index: false } };

    const url = `${SITE_URL}/blog/${post.slug}`;
    const title = post.title;
    const description = post.description ?? undefined;

    return {
      title,
      description,
      authors: [{ name: SITE_NAME, url: SITE_URL }],
      alternates: { canonical: url },
      openGraph: {
        type: "article",
        publishedTime: post.published_at ?? undefined,
        url,
        title,
        description,
        images: post.cover_image ? [{ url: post.cover_image }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: post.cover_image ? [post.cover_image] : undefined,
      },
    };
  } catch {
    return { title: "Article | WealthTrace" };
  }
}

export default async function BlogArticlePage(props: Props) {
  const { slug } = await props.params;

  let post: Awaited<ReturnType<typeof getPublishedPostBySlug>>;
  try {
    post = await getPublishedPostBySlug(slug);
  } catch {
    notFound();
  }

  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const safeHtml = sanitizeBlogHtml(post.content);
  const published = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description ?? undefined,
        datePublished: post.published_at ?? undefined,
        dateModified: post.updated_at ?? post.published_at ?? undefined,
        image: post.cover_image ? [post.cover_image] : undefined,
        author: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link className="hover:text-foreground hover:underline" href="/">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link className="hover:text-foreground hover:underline" href="/blog">
                Blog
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-medium text-foreground">{post.title}</li>
          </ol>
        </nav>

        <header className="mt-8 space-y-4">
          {published && post.published_at ? (
            <time className="text-xs font-semibold uppercase tracking-[0.32em] text-success" dateTime={post.published_at}>
              {published}
            </time>
          ) : null}
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-[2.6rem]">{post.title}</h1>
          {post.description ? <p className="text-lg text-muted-foreground">{post.description}</p> : null}
          {(post.tags ?? []).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {(post.tags ?? []).map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {post.cover_image ? (
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border/80 bg-muted shadow-lg">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
            />
          </div>
        ) : null}

        <div
          className={cn(
            "blog-prose mt-12 space-y-4 text-base leading-relaxed text-foreground",
            "[&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-muted [&_blockquote]:pl-4 [&_blockquote]:italic",
            "[&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold",
            "[&_img]:max-w-full [&_img]:rounded-2xl [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-1",
            "[&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-muted [&_pre]:p-4 [&_code]:font-mono [&_code]:text-sm",
          )}
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />

        <footer className="mt-16 border-t border-border/80 pt-8">
          <Link href="/blog" className={cn(buttonVariants({ variant: "outline" }), "rounded-2xl")}>
            ← Back to blog
          </Link>
        </footer>
      </article>
    </>
  );
}
