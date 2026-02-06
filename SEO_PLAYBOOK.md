# SEO Playbook

## What’s Implemented
- Dynamic metadata (title/description/canonical) across core pages.
- Open Graph + Twitter cards.
- Dynamic `sitemap.xml` and `robots.txt`.
- JSON-LD: WebSite + SearchAction (home), Movie/TVSeries/Episode (detail), BreadcrumbList (navigational).
- Internal linking: breadcrumbs + related titles.
- Pagination handling with canonical to page 1 and `noindex` for page > 1.
- RSS feed at `/feed.xml`.
- Security headers via middleware (no CSP to avoid breaking ads).
- Dev-only `/seo-debug` page (hidden in production).

## Add New Titles to Catalog
1. Open `src/content/catalog.ts`.
2. Add a new movie or series entry under `catalog.movies` or `catalog.series`.
3. Ensure `slug` is unique and URL-safe.
4. Provide `title`, `description`, `posterUrl`, `genres`, `year`, and `updatedAt`.
5. For removed content, set `status: "removed"` to return `410 Gone`.

## Sitemap Submission (Google Search Console)
1. Verify your domain in Search Console.
2. Submit your sitemap URL: `/sitemap.xml` (or `/film/sitemap.xml` if you use basePath).
3. Monitor indexing coverage and fix any reported errors.

## Content Strategy Basics
- Write unique, descriptive summaries for each title.
- Avoid duplicate pages or thin content.
- Keep metadata concise and relevant.
- Build internal links between related titles and categories.
- Maintain a clear site hierarchy (Home → Category → Detail).

## What Not To Do
- No cloaking or hidden text.
- No forced redirects or deceptive interstitials.
- No keyword stuffing or duplicating pages for variants.
- No doorway pages or spammy link farms.

## Development Tips
- Use `/seo-debug` to verify canonical URLs, robots rules, and JSON-LD presence.
- Check `/feed.xml`, `/sitemap.xml`, and `/robots.txt` after changes.
- Run `npm.cmd run build` before deploying to Vercel.
