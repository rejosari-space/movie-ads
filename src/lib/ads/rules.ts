import { AD_CONFIG } from "./config";
import type { AdSlotName } from "./types";

type SlotRule = {
  allow: string[];
  deny?: string[];
};

const SLOT_RULES: Record<AdSlotName, SlotRule> = {
  HEADER: {
    allow: ["*"],
  },
  BELOW_PLAYER_NATIVE: {
    allow: ["/film/*", "/detail/*"],
  },
  INFEED_BANNER: {
    allow: ["/", "/search", "/detail/*"],
  },
};

const normalizePathname = (pathname: string) => {
  if (!pathname) return "/";
  const clean = pathname.split("?")[0].split("#")[0];
  const basePath = AD_CONFIG.basePath;
  if (basePath && clean.startsWith(basePath)) {
    const stripped = clean.slice(basePath.length);
    const normalized = stripped.length === 0 ? "/" : stripped;
    return normalized.length > 1 ? normalized.replace(/\/$/, "") : normalized;
  }
  return clean.length > 1 ? clean.replace(/\/$/, "") : clean;
};

const matchesPattern = (pathname: string, pattern: string) => {
  if (pattern === "*") return true;
  if (pattern.endsWith("/*")) {
    const base = pattern.slice(0, -2);
    return pathname === base || pathname.startsWith(`${base}/`);
  }
  return pathname === pattern;
};

const matchesAny = (pathname: string, patterns: string[]) => {
  return patterns.some((pattern) => matchesPattern(pathname, pattern));
};

export const isSlotEnabled = (slot: AdSlotName, pathname: string) => {
  if (!AD_CONFIG.enabled || !AD_CONFIG.providerEnabled) return false;

  const rule = SLOT_RULES[slot];
  const normalized = normalizePathname(pathname);

  if (rule.deny && (matchesAny(normalized, rule.deny) || matchesAny(pathname, rule.deny))) {
    return false;
  }

  return matchesAny(normalized, rule.allow) || matchesAny(pathname, rule.allow);
};
