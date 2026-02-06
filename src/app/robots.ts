import type { MetadataRoute } from "next";
import { buildCanonical, withBasePath } from "@/lib/seo/urls";

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    withBasePath("/api/"),
    withBasePath("/seo-debug"),
    withBasePath("/ads-test"),
    withBasePath("/affiliate-test"),
    withBasePath("/adblock-test"),
  ];

  return {
    rules: {
      userAgent: "*",
      allow: withBasePath("/"),
      disallow,
    },
    sitemap: buildCanonical("/sitemap.xml"),
  };
}
