-- WealthTrace blog: run in Supabase SQL Editor (or via CLI).
-- Creates posts table with RLS for public read of published rows only.
-- Storage bucket for cover images (public read; uploads via service role from server only).

create extension if not exists "pgcrypto";

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null default '',
  description text,
  tags text[] not null default '{}',
  cover_image text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_posts_published_at_desc on public.posts (published_at desc nulls last);
create index if not exists idx_posts_slug on public.posts (slug);

create or replace function public.set_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row
  execute function public.set_posts_updated_at(); -- Postgres 14+: EXECUTE FUNCTION. If Supabase reports an error, try: EXECUTE PROCEDURE public.set_posts_updated_at();


alter table public.posts enable row level security;

drop policy if exists "posts_select_published_anon" on public.posts;
create policy "posts_select_published_anon"
  on public.posts
  for select
  to anon
  using (
    published_at is not null
    and published_at <= timezone('utc', now())
  );

-- Authenticated role (optional future); service_role bypasses RLS for admin API.

-- Storage: public bucket for cover URLs returned to the client
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-covers',
  'blog-covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "blog_covers_public_read" on storage.objects;
create policy "blog_covers_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'blog-covers');
