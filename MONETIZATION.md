# Monetization

## Slots
- Header banner (Adsterra display, responsive 728x90 / 320x50).
- Native banner below player (Adsterra Native).
- In-feed banner (Adsterra display 300x250; optional 160x600 on desktop if key provided).

## Adblock Gate
When `NEXT_PUBLIC_ADBLOCK_GATE=true`, the app checks for ad blockers using a bait element and a local ad-like asset.
If detected, a full-screen overlay blocks playback on movie pages until the user disables AdBlock and reloads.
On non-movie pages, users can dismiss the gate once per session.

## Disable in Development
Set `NEXT_PUBLIC_ADBLOCK_GATE=false` in your local `.env` to disable the gate.
