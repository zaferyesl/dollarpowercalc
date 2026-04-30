export function slugify(title: string, fallback?: string): string {
  const fromTitle = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return fromTitle || (fallback?.trim() ?? "") || `post-${Date.now()}`;
}
