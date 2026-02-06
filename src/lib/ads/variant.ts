"use client";

import type { AdKeySet, AdSlotName, AdVariant } from "./types";

const VARIANT_COOKIE = "ad_variant";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const setCookie = (name: string, value: string, maxAgeSeconds: number) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
};

export const getVariant = (): AdVariant => {
  const existing = getCookie(VARIANT_COOKIE);
  if (existing === "A" || existing === "B") {
    return existing;
  }
  return "A";
};

export const ensureVariant = (): AdVariant => {
  const existing = getCookie(VARIANT_COOKIE);
  if (existing === "A" || existing === "B") {
    return existing;
  }
  const chosen: AdVariant = Math.random() < 0.5 ? "A" : "B";
  setCookie(VARIANT_COOKIE, chosen, 60 * 60 * 24 * 365);
  return chosen;
};

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const pickKey = (keys: string[], seed: string): string | null => {
  if (!keys || keys.length === 0) return null;
  const index = hashString(seed) % keys.length;
  return keys[index];
};

export const pickKeyForVariant = (keys: AdKeySet, slot: AdSlotName, variant: AdVariant): string | null => {
  const preferred = keys[variant];
  const fallback = keys.A;
  const finalKeys = preferred.length > 0 ? preferred : fallback;
  return pickKey(finalKeys, `${variant}-${slot}`);
};

export const isFrequencyCapped = (slot: AdSlotName, ttlMs: number) => {
  const cookie = getCookie(`ad_cap_${slot}`);
  if (!cookie) return false;
  const expiresAt = Number(cookie);
  if (!Number.isFinite(expiresAt)) return false;
  return Date.now() < expiresAt;
};

export const setFrequencyCap = (slot: AdSlotName, ttlMs: number) => {
  if (!ttlMs) return;
  const expiresAt = Date.now() + ttlMs;
  setCookie(`ad_cap_${slot}`, String(expiresAt), Math.ceil(ttlMs / 1000));
};
