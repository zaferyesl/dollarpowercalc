# dollarpowercalc (WealthTrace)

US-centric financial calculators: **inflation / CPI buying power** and **dividend snowball** projections. Built with **Next.js 15** (App Router), **Tailwind**, **shadcn/ui**, and deployed on **[Vercel](https://vercel.com)**.

**Production domain:** [dollarpowercalc.com](https://dollarpowercalc.com)

## Features

- Inflation calculator (CPI-U) with ISR-backed FRED fetch + anchored fallback data
- Dividend snowball with DRIP toggle, yearly table, charts (mock yield presets — no paid API in MVP)
- SEO: metadata, JSON-LD, `next-sitemap` post-build
- AdSense-ready placeholder slots (replace with live ad units after approval)
- **Blog** at `/blog` (infinite scroll) + ISR; **Article** `/blog/[slug]` with Article + Breadcrumb JSON-LD
- **Admin** at `/admin` (NextAuth credentials + bcrypt), TipTap editor, Supabase Postgres + Storage

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.example` to `.env.local` and fill values (see comments inside the example file).

Important for blog/admin:

```bash
cp .env.example .env.local
```

- **`AUTH_SECRET`**: generate a long random secret (required for sessions).
- **`ADMIN_EMAIL`** + **`ADMIN_PASSWORD_HASH`**: single admin login. Produce the hash locally with  
  `npm run hash-admin-password -- "YourStrongSecretHere"` and paste stdout into `ADMIN_PASSWORD_HASH`.
- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only).
- **`FRED_API_KEY`**: optional; without it CPI calculators still use interpolated anchors.

### Supabase schema

Run [`supabase/migrations/001_blog_posts_and_storage.sql`](supabase/migrations/001_blog_posts_and_storage.sql) in the Supabase SQL editor to create **`posts`** (RLS: public reads only published rows) and the **`blog-covers`** bucket.

## Deploy on Vercel (GitHub)

1. Push this repo to GitHub (`main` branch).
2. In [Vercel Dashboard](https://vercel.com/new) → **Add New Project** → import **`zaferyesl/dollarpowercalc`**.
3. Framework: **Next.js** (auto-detected). **Root directory:** `.` Build command `npm run build`, output `.next`.
4. **Environment variables** → add entries from `.env.example` (`AUTH_*`, Supabase keys, optional `FRED_API_KEY`, GA override, etc.).
5. **Domains** → add `dollarpowercalc.com` and `www.dollarpowercalc.com`, then update DNS per Vercel’s instructions.

Vercel runs `npm run build`, which executes `postbuild` → `next-sitemap` (generates `public/sitemap.xml` and `public/robots.txt`).

## Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm run dev`  | Dev server (Turbopack)      |
| `npm run build`| Production build + sitemap  |
| `npm run start`| Start production server     |
| `npm run lint` | ESLint                      |
| `npm run hash-admin-password -- "pwd"` | Bcrypt-hash for `ADMIN_PASSWORD_HASH` |

## License

Private — all rights reserved unless otherwise noted.
