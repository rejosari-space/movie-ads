export type CatalogBase = {
  slug: string;
  title: string;
  description: string;
  posterUrl: string;
  genres: string[];
  year: number;
  rating?: number;
  updatedAt?: string;
  status?: "active" | "removed";
};

export type CatalogMovie = CatalogBase & {
  kind: "movie";
  durationMins: number;
};

export type CatalogEpisode = {
  title: string;
  episodeNumber: number;
  seasonNumber: number;
  airDate?: string;
};

export type CatalogSeason = {
  seasonNumber: number;
  episodes: CatalogEpisode[];
};

export type CatalogSeries = CatalogBase & {
  kind: "series";
  seasons: CatalogSeason[];
};

export type CatalogItem = CatalogMovie | CatalogSeries;

export const catalog = {
  movies: [
    {
      kind: "movie",
      slug: "midnight-train",
      title: "Midnight Train",
      description:
        "Seorang penyiar radio menerima panggilan misterius yang membawanya ke perjalanan gelap di malam hari.",
      posterUrl: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4",
      genres: ["thriller", "mystery"],
      year: 2024,
      rating: 7.8,
      durationMins: 112,
      updatedAt: "2025-11-02",
    },
    {
      kind: "movie",
      slug: "ocean-echoes",
      title: "Ocean Echoes",
      description:
        "Seorang penyelam menemukan pesan rahasia di dasar laut yang mengubah hidupnya.",
      posterUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      genres: ["adventure", "drama"],
      year: 2023,
      rating: 7.3,
      durationMins: 104,
      updatedAt: "2025-10-10",
    },
    {
      kind: "movie",
      slug: "city-of-lights",
      title: "City of Lights",
      description:
        "Dua sahabat mengejar mimpi di kota metropolitan yang tidak pernah tidur.",
      posterUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
      genres: ["romance", "drama"],
      year: 2022,
      rating: 7.1,
      durationMins: 98,
      updatedAt: "2025-09-18",
    },
  ] satisfies CatalogMovie[],
  series: [
    {
      kind: "series",
      slug: "shadow-harbor",
      title: "Shadow Harbor",
      description:
        "Serial investigasi tentang kota pelabuhan yang menyembunyikan rahasia besar.",
      posterUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
      genres: ["crime", "thriller"],
      year: 2024,
      rating: 8.1,
      updatedAt: "2025-12-01",
      seasons: [
        {
          seasonNumber: 1,
          episodes: [
            { title: "Harbor Lights", episodeNumber: 1, seasonNumber: 1, airDate: "2024-02-01" },
            { title: "Cold Current", episodeNumber: 2, seasonNumber: 1, airDate: "2024-02-08" },
          ],
        },
      ],
    },
    {
      kind: "series",
      slug: "planet-rare",
      title: "Planet Rare",
      description:
        "Dokuseri eksplorasi ekosistem langka dan komunitas yang menjaganya.",
      posterUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
      genres: ["documentary", "adventure"],
      year: 2021,
      rating: 8.4,
      updatedAt: "2025-08-12",
      seasons: [
        {
          seasonNumber: 1,
          episodes: [
            { title: "Hidden Valleys", episodeNumber: 1, seasonNumber: 1, airDate: "2021-06-15" },
            { title: "Sky Islands", episodeNumber: 2, seasonNumber: 1, airDate: "2021-06-22" },
          ],
        },
      ],
    },
  ] satisfies CatalogSeries[],
};

export const allTitles: CatalogItem[] = [...catalog.movies, ...catalog.series];

export const getTitleBySlug = (slug: string): CatalogItem | undefined =>
  allTitles.find((item) => item.slug === slug);

export const getGenres = (): string[] => {
  const set = new Set<string>();
  allTitles.forEach((item) => item.genres.forEach((genre) => set.add(genre)));
  return Array.from(set).sort();
};

export const getLatestTitles = (limit = 20): CatalogItem[] => {
  return [...allTitles]
    .sort((a, b) => {
      const aDate = new Date(a.updatedAt ?? `${a.year}-01-01`).getTime();
      const bDate = new Date(b.updatedAt ?? `${b.year}-01-01`).getTime();
      return bDate - aDate;
    })
    .slice(0, limit);
};

export const getRelatedTitles = (slug: string, limit = 6): CatalogItem[] => {
  const current = getTitleBySlug(slug);
  if (!current) return [];
  const pool = allTitles.filter((item) => item.slug !== slug && item.status !== "removed");
  const scored = pool.map((item) => {
    const shared = item.genres.filter((g) => current.genres.includes(g)).length;
    return { item, score: shared };
  });
  return scored
    .sort((a, b) => b.score - a.score || b.item.year - a.item.year)
    .slice(0, limit)
    .map((entry) => entry.item);
};

export const getRemovedSlugs = (): string[] =>
  allTitles.filter((item) => item.status === "removed").map((item) => item.slug);

export const getDefaultOgImage = (): string =>
  allTitles[0]?.posterUrl || "/placeholder-poster.svg";
