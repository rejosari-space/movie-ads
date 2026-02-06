import { getSiteOrigin } from "@/lib/seo/urls";

const toOrigin = (value?: string) => {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const uniq = (values: Array<string | null>) => {
  const set = new Set<string>();
  values.forEach((value) => {
    if (value) set.add(value);
  });
  return Array.from(set);
};

export default function Head() {
  const bannerBase = process.env.NEXT_PUBLIC_ADSTERRA_BANNER_SCRIPT_BASE;
  const nativeBase = process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_BASE;

  const origins = uniq([
    getSiteOrigin(),
    toOrigin(bannerBase || "https://www.topcreativeformat.com/"),
    toOrigin(nativeBase || ""),
  ]);

  return (
    <>
      {origins.map((origin) => (
        <link key={`dns-${origin}`} rel="dns-prefetch" href={origin} />
      ))}
      {origins.map((origin) => (
        <link key={`pre-${origin}`} rel="preconnect" href={origin} crossOrigin="" />
      ))}
    </>
  );
}
