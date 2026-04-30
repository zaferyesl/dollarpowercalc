export type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  content: string;
  description: string | null;
  tags: string[];
  cover_image: string | null;
  published_at: string | null;
  created_at?: string;
  updated_at?: string;
};

/** Public-safe fields */
export type BlogPostCard = Omit<BlogPostRow, "content" | "created_at" | "updated_at">;
