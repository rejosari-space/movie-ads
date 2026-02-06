# Shopee Affiliate System

## How It Works
1. User clicks **Play** (movie) or an **Episode** (series).
2. A pre-play modal may appear depending on rules.
3. If user clicks **Open**, a new tab opens `/go/shopee?...` which redirects to Shopee.
4. Playback continues immediately after user clicks **Play** or **Open**.

## Where To Edit Links
Edit affiliate URLs in:
- `src/lib/affiliate/shopee.config.ts`

Available IDs:
- `DEFAULT_HIGH_COMMISSION`
- `FALLBACK_SHOP`

## Movie vs Series Rules
- Movie: modal shows **every** Play click.
- Series: modal shows **every 3 episodes** per series.
  - Counter stored in `localStorage` key: `shopee_episode_count_<seriesId>`

## Why Adsterra Is Unaffected
This system is isolated and does **not** touch any Adsterra scripts, components, or layout.

## How To Test Locally
1. Run `npm run dev`
2. Open:
   - `/film/affiliate-test` for simulator
   - `/film/detail/<slug>` for real flow
3. Click Play / Episode and verify modal behavior.

## Notes
- Redirects only happen on explicit user click.
- No DB, no tracking pixels, only `console.log` in the redirect route.
