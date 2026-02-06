"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import AdLabel from "@/components/ads/AdLabel";
import {
  AD_CONFIG,
  ADSTERRA_BANNER_SCRIPT_BASE,
  ADSTERRA_NATIVE_SCRIPT_BASE,
  getSlotKeySet,
  getSlotMinHeight,
  getSlotSize,
} from "@/lib/ads/config";
import { isSlotEnabled } from "@/lib/ads/rules";
import {
  ensureVariant,
  isFrequencyCapped,
  pickKeyForVariant,
  setFrequencyCap,
} from "@/lib/ads/variant";
import type { AdSlotName } from "@/lib/ads/types";

type AdSlotProps = {
  slot: AdSlotName;
  className?: string;
  showLabel?: boolean;
  forcePathname?: string;
};

const FALLBACK_BREAKPOINT = 768;

const AdSlot = ({ slot, className, showLabel = true, forcePathname }: AdSlotProps) => {
  const pathname = usePathname() ?? "/";
  const resolvedPathname = forcePathname ?? pathname;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scriptInjectedRef = useRef(false);

  const [isMobile, setIsMobile] = useState(false);

  const slotConfig = AD_CONFIG.slots[slot];
  const responsiveBreakpoint = slotConfig.responsive?.breakpoint ?? FALLBACK_BREAKPOINT;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < responsiveBreakpoint);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [responsiveBreakpoint]);

  const enabled = useMemo(
    () => isSlotEnabled(slot, resolvedPathname),
    [slot, resolvedPathname]
  );

  const keySet = getSlotKeySet(slot, isMobile);
  const size = getSlotSize(slot, isMobile);
  const minHeight = getSlotMinHeight(slot, isMobile);

  const [variant, setVariant] = useState<"A" | "B">("A");
  useEffect(() => {
    setVariant(ensureVariant());
  }, []);
  const activeKey = useMemo(
    () => pickKeyForVariant(keySet, slot, variant),
    [keySet, slot, variant]
  );
  const isCapped = slotConfig.capTtlMs ? isFrequencyCapped(slot, slotConfig.capTtlMs) : false;

  useEffect(() => {
    if (!slotConfig.capTtlMs) return;
    if (isCapped) return;
    setFrequencyCap(slot, slotConfig.capTtlMs);
  }, [slot, slotConfig.capTtlMs, isCapped]);

  useEffect(() => {
    if (!enabled || !activeKey) return;
    if (typeof window === "undefined") return;
    const event = new CustomEvent("ads:refresh", { detail: { slot, key: activeKey } });
    window.dispatchEvent(event);
  }, [enabled, activeKey, slot]);

  if (!enabled) return null;

  const containerId = `ad-slot-${slot.toLowerCase()}`;
  const shouldRenderAd = Boolean(activeKey) && !isCapped;
  const slotSize = size ?? undefined;

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";
    containerRef.current.removeAttribute("id");
    scriptInjectedRef.current = false;

    if (!shouldRenderAd || !activeKey) return;

    if (slotConfig.provider !== "adsterra") return;

    const container = containerRef.current;
    if (!container) return;

    const isBannerSlot = slot === "HEADER" || slot === "INFEED_BANNER";
    if (isBannerSlot) {
      const height = slotSize?.height ?? minHeight;
      const fallbackWidth = slot === "HEADER" ? 728 : 300;
      const width = slotSize?.width ?? fallbackWidth;
      (window as typeof window & { atOptions?: Record<string, unknown> }).atOptions = {
        key: activeKey,
        format: "iframe",
        height,
        width,
        params: {},
      };

      const script = document.createElement("script");
      script.async = true;
      script.src = `${ADSTERRA_BANNER_SCRIPT_BASE}${activeKey}/invoke.js`;
      container.appendChild(script);
      scriptInjectedRef.current = true;
      return;
    }

    if (!ADSTERRA_NATIVE_SCRIPT_BASE) return;

    const nativeContainerId = `container-${activeKey}`;
    container.id = nativeContainerId;
    const script = document.createElement("script");
    script.async = true;
    script.src = `${ADSTERRA_NATIVE_SCRIPT_BASE}${activeKey}/invoke.js`;
    container.appendChild(script);
    scriptInjectedRef.current = true;
  }, [activeKey, minHeight, shouldRenderAd, slot, slotConfig.provider, slotSize]);

  const outerClassName = `ad-slot ${!shouldRenderAd ? "ad-slot--empty" : ""} ${className ?? ""}`.trim();

  return (
    <div
      className={outerClassName}
      style={{ minHeight }}
      data-slot={slot}
      data-variant={variant}
      aria-label="Advertisement"
      role="region"
    >
      {showLabel && shouldRenderAd && <AdLabel />}
      <div
        id={containerId}
        ref={containerRef}
        className={`ad-slot-inner ${shouldRenderAd ? "" : "ad-slot-empty"}`.trim()}
        data-ad-provider={slotConfig.provider}
        data-ad-key={activeKey ?? ""}
        data-ad-slot={slot}
        data-ad-size={size ? `${size.width}x${size.height}` : ""}
        data-ad-width={size?.width ?? ""}
        data-ad-height={size?.height ?? ""}
      />
    </div>
  );
};

export default AdSlot;
