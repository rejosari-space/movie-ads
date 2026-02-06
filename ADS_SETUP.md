# Ads Setup

**Environment Variables**
1. In Vercel Project Settings, open Environment Variables.
2. Add these keys (Production and Preview as needed):
3. `NEXT_PUBLIC_ADS_ENABLED=true`
4. `NEXT_PUBLIC_ADSTERRA_ENABLED=true`
5. `NEXT_PUBLIC_ADSTERRA_HEADER_728_KEY=YOUR_KEY_OR_KEYS`
6. `NEXT_PUBLIC_ADSTERRA_MOBILE_320_KEY=YOUR_KEY_OR_KEYS`
7. `NEXT_PUBLIC_ADSTERRA_NATIVE_KEY=YOUR_KEY_OR_KEYS`
8. `NEXT_PUBLIC_ADSTERRA_BANNER_300_KEY=YOUR_KEY_OR_KEYS`
9. Optional: `NEXT_PUBLIC_ADSTERRA_BANNER_160x600_KEY=YOUR_KEY_OR_KEYS`
10. Optional loader URL: `NEXT_PUBLIC_ADSTERRA_SCRIPT_SRC=YOUR_LOADER_URL`
11. Optional banner script base: `NEXT_PUBLIC_ADSTERRA_BANNER_SCRIPT_BASE=https://www.topcreativeformat.com/`
12. Optional native script base: `NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_BASE=https://plXXXX.effectivegatecpm.com/`
13. Optional base path for rules: `NEXT_PUBLIC_ADS_BASE_PATH=/film`

**Key Format**
1. Single key: `KEY123`
2. Multiple keys: `KEY1,KEY2,KEY3`
3. A/B split: `KEYA1,KEYA2|KEYB1,KEYB2`
4. If B is omitted, A is reused.

**Mapping From Adsterra "Get Code"**
1. Banner 728x90 snippet:
2. Use the `key` from `atOptions` for `NEXT_PUBLIC_ADSTERRA_HEADER_728_KEY`.
3. If your snippet shows a script domain different from `https://www.topcreativeformat.com/`, set `NEXT_PUBLIC_ADSTERRA_BANNER_SCRIPT_BASE` to that domain (include trailing slash).
4. Mobile banner 320x50: use the `key` from the 320x50 snippet in `NEXT_PUBLIC_ADSTERRA_MOBILE_320_KEY`.
5. Native banner snippet:
6. Copy the `key` from the script URL (the long hash before `/invoke.js`) into `NEXT_PUBLIC_ADSTERRA_NATIVE_KEY`.
7. Copy the domain part (example: `https://pl28663382.effectivegatecpm.com/`) into `NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_BASE`.
8. In-feed banner 300x250: use the `key` in `NEXT_PUBLIC_ADSTERRA_BANNER_300_KEY`.
9. Optional 160x600: use the `key` in `NEXT_PUBLIC_ADSTERRA_BANNER_160x600_KEY`.

**Recommended Placements (Full-Width Streaming)**
1. Header banner: just below the main navigation.
2. Below player native: directly under the video player.
3. In-feed banner: between content blocks on the homepage, search results, or episode lists.

**How CPM Works (Impressions)**
1. Ads are rendered on view, impressions count without requiring clicks.
2. Slots reserve space to avoid CLS, improving viewability and CPM stability.
3. Ad scripts load after interactive to protect Core Web Vitals.

**Adding New Slots**
1. Add a slot name in `src/lib/ads/types.ts`.
2. Define slot config in `src/lib/ads/config.ts`.
3. Add route rules in `src/lib/ads/rules.ts`.
4. Render with `AdSlot` in the target page or layout.
5. Update `/ads-test` to validate the new slot.

**Troubleshooting**
1. Ad not showing: confirm keys are set and `NEXT_PUBLIC_ADS_ENABLED=true`.
2. Domain approval: ensure your Adsterra domain is verified and active.
3. Adblock: test in a clean browser profile or disable extensions.
4. Layout shifts: verify `minHeight` values in `config.ts`.
5. Wrong route: check `src/lib/ads/rules.ts` and base path.

**Notes**
1. The loader script is optional. If your Adsterra account requires a different loader, set `NEXT_PUBLIC_ADSTERRA_SCRIPT_SRC` accordingly.
2. The system does not use popunders, redirects, or interstitials.
