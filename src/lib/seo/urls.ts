const DEFAULT_SITE_URL = "https://example.com";

export const getSiteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;

export const getSiteOrigin = () => {
  const siteUrl = getSiteUrl();
  try {
    return new URL(siteUrl).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
};

export const getBasePath = () =>
  process.env.NEXT_PUBLIC_BASE_PATH ||
  process.env.NEXT_PUBLIC_ADS_BASE_PATH ||
  "/film";

export const normalizePath = (path: string) => {
  if (!path) return "/";
  let normalized = path.split("?")[0].split("#")[0];
  if (!normalized.startsWith("/")) normalized = `/${normalized}`;
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
};

export const withBasePath = (path: string) => {
  const basePath = normalizePath(getBasePath());
  const normalized = normalizePath(path);
  if (basePath === "/" || basePath === "") return normalized;
  if (normalized === "/") return basePath;
  return normalizePath(`${basePath}${normalized}`);
};

export const buildCanonical = (path: string) => {
  const origin = getSiteOrigin();
  const withBase = withBasePath(path);
  return `${origin}${withBase}`;
};

export const toAbsoluteUrl = (value: string) => {
  try {
    return new URL(value).toString();
  } catch {
    return buildCanonical(value);
  }
};
