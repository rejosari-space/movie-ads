import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${siteUrl}/`, lastModified },
    { url: `${siteUrl}/search`, lastModified },
    { url: `${siteUrl}/categories`, lastModified },
    { url: `${siteUrl}/category`, lastModified },
    { url: `${siteUrl}/detail`, lastModified },
    { url: `${siteUrl}/disclaimer`, lastModified },
  ];
}
