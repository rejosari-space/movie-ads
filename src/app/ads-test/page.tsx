"use client";

import { useEffect, useMemo, useState } from "react";
import AdSlot from "@/components/ads/AdSlot";
import { AD_CONFIG, getSlotKeySet, getSlotMinHeight, getSlotSize } from "@/lib/ads/config";
import { getVariant, ensureVariant, pickKeyForVariant } from "@/lib/ads/variant";
import { isSlotEnabled } from "@/lib/ads/rules";
import type { AdSlotName } from "@/lib/ads/types";

const ROUTE_OPTIONS = [
  "/",
  "/search",
  "/genre/action",
  "/detail/sample-slug",
  "/film/detail/sample-slug",
  "/categories",
];

const SLOT_NAMES: AdSlotName[] = ["HEADER", "BELOW_PLAYER_NATIVE", "INFEED_NATIVE"];

const AdsTestPage = () => {
  const [pathname, setPathname] = useState("/");
  const [viewportWidth, setViewportWidth] = useState<number>(1200);

  const [variant, setVariant] = useState<"A" | "B">("A");

  useEffect(() => {
    setVariant(ensureVariant());
    const updateSize = () => setViewportWidth(window.innerWidth);
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const isMobile = viewportWidth < 768;
  const currentVariant = variant || getVariant();

  const slotSummaries = useMemo(
    () =>
      SLOT_NAMES.map((slot) => {
        const keySet = getSlotKeySet(slot, isMobile);
        const key = pickKeyForVariant(keySet, slot, currentVariant) ?? "(missing)";
        const enabled = isSlotEnabled(slot, pathname);
        const size = getSlotSize(slot, isMobile);
        const minHeight = getSlotMinHeight(slot, isMobile);
        return { slot, key, enabled, size, minHeight };
      }),
    [isMobile, pathname, variant]
  );

  return (
    <div className="container" style={{ padding: "30px 0 60px" }}>
      <h1 style={{ marginBottom: "10px" }}>Ads Test</h1>
      <p style={{ color: "var(--text-secondary)" }}>
        Halaman ini untuk memverifikasi slot, aturan route, dan key aktif tanpa database.
      </p>

      <div style={{ margin: "20px 0", display: "grid", gap: "10px" }}>
        <label style={{ fontWeight: 600 }}>Simulasi Pathname</label>
        <select
          value={pathname}
          onChange={(event) => setPathname(event.target.value)}
          style={{
            padding: "10px 12px",
            borderRadius: "6px",
            background: "var(--surface-color)",
            color: "var(--text-primary)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {ROUTE_OPTIONS.map((route) => (
            <option key={route} value={route}>
              {route}
            </option>
          ))}
        </select>

        <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Ads enabled: {String(AD_CONFIG.enabled)} | Adsterra enabled:{" "}
          {String(AD_CONFIG.providerEnabled)} | Variant: {currentVariant} | Viewport: {viewportWidth}px
        </div>
      </div>

      <div style={{ display: "grid", gap: "24px" }}>
        {slotSummaries.map((summary) => (
          <div
            key={summary.slot}
            style={{
              padding: "16px",
              borderRadius: "8px",
              background: "var(--surface-color)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
              <strong>{summary.slot}</strong>
              <span style={{ color: summary.enabled ? "#6bcf7f" : "#ff6b6b" }}>
                {summary.enabled ? "ENABLED" : "DISABLED"}
              </span>
            </div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "6px" }}>
              Key: {summary.key} | Size: {summary.size ? `${summary.size.width}x${summary.size.height}` : "native"} |
              Min height: {summary.minHeight}px
            </div>
            <div style={{ marginTop: "12px" }}>
              <AdSlot slot={summary.slot} forcePathname={pathname} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdsTestPage;
