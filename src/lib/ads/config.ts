import type { AdKeySet, AdSlotName, AdSlotConfig, AdSize, AdSystemConfig } from "./types";

const toBoolean = (value: string | undefined) => value === "true";

const parseKeyList = (value?: string): string[] => {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseKeySet = (value?: string): AdKeySet => {
  if (!value) {
    return { A: [], B: [] };
  }

  const [variantA, variantB] = value.split("|");
  const keysA = parseKeyList(variantA);
  const keysB = parseKeyList(variantB);

  return {
    A: keysA,
    B: keysB.length > 0 ? keysB : keysA,
  };
};

const ADS_ENABLED = toBoolean(process.env.NEXT_PUBLIC_ADS_ENABLED);
const ADSTERRA_ENABLED = toBoolean(process.env.NEXT_PUBLIC_ADSTERRA_ENABLED);
const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  process.env.NEXT_PUBLIC_ADS_BASE_PATH ||
  "/film";

const headerDesktopKeys = parseKeySet(process.env.NEXT_PUBLIC_ADSTERRA_HEADER_728_KEY);
const headerMobileKeys = parseKeySet(process.env.NEXT_PUBLIC_ADSTERRA_MOBILE_320_KEY);
const nativeKeys = parseKeySet(process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_KEY);
const banner300Keys = parseKeySet(process.env.NEXT_PUBLIC_ADSTERRA_BANNER_300_KEY);
const banner160Keys = parseKeySet(process.env.NEXT_PUBLIC_ADSTERRA_BANNER_160x600_KEY);

export const ADSTERRA_BANNER_SCRIPT_BASE =
  process.env.NEXT_PUBLIC_ADSTERRA_BANNER_SCRIPT_BASE || "https://www.topcreativeformat.com/";

export const ADSTERRA_NATIVE_SCRIPT_BASE =
  process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_BASE || "";

const headerDesktopSize: AdSize = { width: 728, height: 90 };
const headerMobileSize: AdSize = { width: 320, height: 50 };
const bannerMobileSize: AdSize = { width: 300, height: 250 };
const bannerDesktopSize: AdSize = { width: 160, height: 600 };

const HEADER_CONFIG: AdSlotConfig = {
  slot: "HEADER",
  provider: "adsterra",
  label: "Iklan",
  minHeight: headerDesktopSize.height,
  placement: "Header banner",
  keys: headerDesktopKeys,
  responsive: {
    breakpoint: 768,
    desktop: headerDesktopSize,
    mobile: headerMobileSize,
    desktopKeys: headerDesktopKeys,
    mobileKeys: headerMobileKeys,
  },
};

const BELOW_PLAYER_CONFIG: AdSlotConfig = {
  slot: "BELOW_PLAYER_NATIVE",
  provider: "adsterra",
  label: "Iklan",
  minHeight: 120,
  placement: "Below player",
  keys: nativeKeys,
};

const INFEED_CONFIG: AdSlotConfig = {
  slot: "INFEED_BANNER",
  provider: "adsterra",
  label: "Iklan",
  minHeight: bannerMobileSize.height,
  placement: "In-feed banner",
  keys: banner300Keys,
  responsive: {
    breakpoint: 1024,
    desktop: bannerDesktopSize,
    mobile: bannerMobileSize,
    desktopKeys: banner160Keys,
    mobileKeys: banner300Keys,
  },
};

export const AD_CONFIG: AdSystemConfig = {
  enabled: ADS_ENABLED,
  providerEnabled: ADSTERRA_ENABLED,
  basePath: BASE_PATH,
  slots: {
    HEADER: HEADER_CONFIG,
    BELOW_PLAYER_NATIVE: BELOW_PLAYER_CONFIG,
    INFEED_BANNER: INFEED_CONFIG,
  },
};

export const hasKeySet = (keySet: AdKeySet | undefined | null) => {
  if (!keySet) return false;
  return keySet.A.length > 0 || keySet.B.length > 0;
};

export const getSlotKeySet = (slot: AdSlotName, isMobile: boolean): AdKeySet => {
  const config = AD_CONFIG.slots[slot];
  if (config.responsive) {
    const preferred = isMobile
      ? config.responsive.mobileKeys ?? config.keys
      : config.responsive.desktopKeys ?? config.keys;
    if (!hasKeySet(preferred)) {
      return config.keys;
    }
    return preferred;
  }
  return config.keys;
};

export const getSlotSize = (slot: AdSlotName, isMobile: boolean): AdSize | null => {
  const config = AD_CONFIG.slots[slot];
  if (!config.responsive) return null;
  if (!isMobile && config.responsive.desktopKeys && !hasKeySet(config.responsive.desktopKeys)) {
    return config.responsive.mobile;
  }
  return isMobile ? config.responsive.mobile : config.responsive.desktop;
};

export const getSlotMinHeight = (slot: AdSlotName, isMobile: boolean): number => {
  const config = AD_CONFIG.slots[slot];
  if (config.responsive) {
    const size = getSlotSize(slot, isMobile);
    return size?.height ?? config.minHeight;
  }
  return config.minHeight;
};
