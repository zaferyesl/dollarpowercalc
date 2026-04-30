# dollarpowercalc (WealthTrace)

US-centric financial calculators: **inflation / CPI buying power** and **dividend snowball** projections. Built with **Next.js 15** (App Router), **Tailwind**, **shadcn/ui**, and deployed on **[Vercel](https://vercel.com)**.

**Production domain:** [dollarpowercalc.com](https://dollarpowercalc.com)

## Features

- Inflation calculator (CPI-U) with ISR-backed FRED fetch + anchored fallback data
- Dividend snowball with DRIP toggle, yearly table, charts (mock yield presets — no paid API in MVP)
- SEO: metadata, JSON-LD, `next-sitemap` post-build
- AdSense-ready placeholder slots (replace with live ad units after approval)

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.example` to `.env.local` for optional St. Louis Fed CPI calls:

```bash
cp .env.example .env.local
# set FRED_API_KEY=your_key
```

Without `FRED_API_KEY`, CPI still works using interpolated anchors.

## Deploy on Vercel (GitHub)

1. Push this repo to GitHub (`main` branch).
2. In [Vercel Dashboard](https://vercel.com/new) → **Add New Project** → import **`zaferyesl/dollarpowercalc`**.
3. Framework: **Next.js** (auto-detected). **Root directory:** `.` Build command `npm run build`, output `.next`.
4. **Environment variables** → add `FRED_API_KEY` for Production / Preview if you want live FRED data.
5. **Domains** → add `dollarpowercalc.com` and `www.dollarpowercalc.com`, then update DNS per Vercel’s instructions.

Vercel runs `npm run build`, which executes `postbuild` → `next-sitemap` (generates `public/sitemap.xml` and `public/robots.txt`).

## Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm run dev`  | Dev server (Turbopack)      |
| `npm run build`| Production build + sitemap  |
| `npm run start`| Start production server     |
| `npm run lint` | ESLint                      |

## License

Private — all rights reserved unless otherwise noted.
