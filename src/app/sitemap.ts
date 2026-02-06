import type { MetadataRoute } from "next";
import { allTitles, getGenres } from "@/content/catalog";
import { buildCanonical } from "@/lib/seo/urls";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    "/",
    "/search",
    "/categories",
    "/category",
    "/detail",
    "/disclaimer",
  ];

  const categorySlugs = [
    "trending",
    "indonesian-movies",
    "indonesian-drama",
    "kdrama",
    "short-tv",
    "anime",
    "adult-comedy",
    "western-tv",
    "indo-dub",
  ];

  const categorySet = new Set<string>([...categorySlugs, ...getGenres()]);
  const categoryPaths = Array.from(categorySet).map((genre) => `/category/${genre}`);

  const itemPaths = allTitles.map((item) => ({
    url: buildCanonical(`/detail/${item.slug}`),
    lastModified: new Date(item.updatedAt ?? `${item.year}-01-01`),
  }));

  const urls: MetadataRoute.Sitemap = [
    ...staticPaths.map((path) => ({
      url: buildCanonical(path),
      lastModified: now,
    })),
    ...categoryPaths.map((path) => ({
      url: buildCanonical(path),
      lastModified: now,
    })),
    ...itemPaths,
  ];

  return urls;
}
