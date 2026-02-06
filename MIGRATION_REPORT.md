# Migration Report

## Summary
- Source Vite repo (read-only): D:\PLAYGROUND\rebahan-streaming
- New Next.js repo: D:\PLAYGROUND\repo-next
- Next.js App Router + TypeScript + ESLint created and migrated
- Next.js `basePath` set to `/film` to match the original Vite `base`/router `basename`

## Route Mapping
- `/` -> `src/app/page.tsx`
- `/search` -> `src/app/search/page.tsx` (uses `SearchClient` with Suspense)
- `/detail/:detailPath?` ->
  - `/detail` -> `src/app/detail/page.tsx`
  - `/detail/[detailPath]` -> `src/app/detail/[detailPath]/page.tsx`
- `/category/:category?` ->
  - `/category` -> `src/app/category/page.tsx`
  - `/category/[category]` -> `src/app/category/[category]/page.tsx`
- `/categories` -> `src/app/categories/page.tsx`
- `/disclaimer` -> `src/app/disclaimer/page.tsx`

## What Changed and Why
- `react-router-dom` removed and replaced by Next.js App Router file-based routes.
- Client-side pages/components were preserved but reorganized for App Router:
  - Client logic moved into `src/components/pages/*Client.tsx` where needed.
  - Dynamic routes use `generateMetadata` in server `page.tsx` files.
- Matched the original `/film` base path via `next.config.ts` to keep route behavior consistent.
- Global styling consolidated into `src/app/globals.css` to satisfy Next's global CSS rules.
- Added SEO metadata and metadata routes:
  - `src/app/layout.tsx` for global metadata
  - `src/app/sitemap.ts` and `src/app/robots.ts`
- Added flexible ad system:
  - `src/components/ads/AdSlot.tsx`
  - `src/components/ads/AdScripts.tsx`
  - Example placements in layout, home, and detail pages
- API layer moved to `src/services/api.ts` with optional `NEXT_PUBLIC_API_BASE` override.

## SEO Implementation
- Global metadata in `src/app/layout.tsx` (title template, description, Open Graph, robots).
- Per-page metadata via `generateMetadata` on dynamic pages:
  - `src/app/detail/[detailPath]/page.tsx`
  - `src/app/category/[category]/page.tsx`
- Sitemap and robots via Next metadata routes:
  - `src/app/sitemap.ts`
  - `src/app/robots.ts`

## Ads System
- Ad scripts (safe strategy): `src/components/ads/AdScripts.tsx`
- Reusable slot component: `src/components/ads/AdSlot.tsx`
- Current placements:
  - Layout header banner: `ad-header-banner`
  - Home top: `ad-home-top`
  - Detail below player: `ad-below-player`
  - Detail sidebar: `ad-sidebar`

## Environment Variables
- `.env.example` added in `repo-next`:
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_API_BASE`
  - `NEXT_PUBLIC_AD_SCRIPT_SRC`
  - `NEXT_PUBLIC_AD_NETWORK`

## How To Add New Pages
1. Create a folder under `src/app/<route>/page.tsx`.
2. For dynamic routes, use `src/app/<route>/[param]/page.tsx` and add `generateMetadata`.
3. If the page uses hooks, move UI into a client component and wrap with a server `page.tsx`.
4. Add the route to `src/app/sitemap.ts` if you want it indexed.

## How To Add Ad Placements
- Import `AdSlot` and drop it wherever needed:
  - `import AdSlot from "@/components/ads/AdSlot"`
- For network scripts, set `NEXT_PUBLIC_AD_SCRIPT_SRC` and (optionally) `NEXT_PUBLIC_AD_NETWORK`.
- Ad scripts are included once in `src/app/layout.tsx`.

## TODOs / Manual Confirmation
- Update `NEXT_PUBLIC_SITE_URL` in `.env.local` for correct sitemap/OG URLs in production.
- Add real ad network script URL to `NEXT_PUBLIC_AD_SCRIPT_SRC`.
