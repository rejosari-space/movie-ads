const CACHE_KEY = "adblock_detect_cache_v1";
const CACHE_TTL_MS = 10 * 60 * 1000;
const ASSET_PATH = "/ads.js";
const FETCH_TIMEOUT_MS = 1500;

type CachePayload = {
  value: boolean;
  ts: number;
};

const readCache = (): boolean | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachePayload;
    if (!parsed || typeof parsed.ts !== "number") return null;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return Boolean(parsed.value);
  } catch {
    return null;
  }
};

const writeCache = (value: boolean) => {
  if (typeof window === "undefined") return;
  try {
    const payload: CachePayload = { value, ts: Date.now() };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // ignore cache errors
  }
};

export const clearAdblockCache = () => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
};

const checkBaitElement = async (): Promise<boolean> => {
  if (typeof document === "undefined") return false;
  const bait = document.createElement("div");
  bait.className = "adsbygoogle adsbox ad-banner ad-container ad-slot";
  bait.setAttribute("aria-hidden", "true");
  bait.style.cssText =
    "position:absolute !important; left:-9999px !important; top:-9999px !important; width:1px !important; height:1px !important; pointer-events:none !important;";
  document.body.appendChild(bait);

  await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 50)));

  const style = window.getComputedStyle(bait);
  const blocked =
    style.display === "none" ||
    style.visibility === "hidden" ||
    bait.offsetParent === null ||
    bait.offsetHeight === 0 ||
    bait.offsetWidth === 0;

  bait.remove();
  return blocked;
};

const fetchWithTimeout = async (url: string, timeoutMs: number): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { cache: "no-store", signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const checkAdLikeAsset = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false;
  try {
    const response = await fetchWithTimeout(ASSET_PATH, FETCH_TIMEOUT_MS);
    return !response.ok;
  } catch {
    return true;
  }
};

export const detectAdblock = async (): Promise<boolean> => {
  if (typeof window === "undefined") return false;
  const cached = readCache();
  if (cached !== null) return cached;

  const [baitBlocked, assetBlocked] = await Promise.all([
    checkBaitElement(),
    checkAdLikeAsset(),
  ]);

  const detected = baitBlocked || assetBlocked;
  writeCache(detected);
  return detected;
};
