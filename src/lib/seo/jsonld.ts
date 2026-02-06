import type {
  CatalogEpisode,
  CatalogMovie,
  CatalogSeries,
} from "@/content/catalog";
import { buildCanonical, toAbsoluteUrl } from "@/lib/seo/urls";

const schemaContext = "https://schema.org";

const formatDuration = (mins?: number) => {
  if (!mins) return undefined;
  return `PT${mins}M`;
};

const ratingValue = (value?: number) => {
  if (!value) return undefined;
  return {
    "@type": "AggregateRating",
    ratingValue: value,
    ratingCount: Math.max(10, Math.round(value * 50)),
  };
};

export const websiteJsonLd = (siteName: string) => ({
  "@context": schemaContext,
  "@type": "WebSite",
  name: siteName,
  url: buildCanonical("/"),
  potentialAction: {
    "@type": "SearchAction",
    target: `${buildCanonical("/search")}?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const breadcrumbJsonLd = (items: { name: string; url: string }[]) => ({
  "@context": schemaContext,
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: toAbsoluteUrl(item.url),
  })),
});

export const movieJsonLd = (movie: CatalogMovie) => ({
  "@context": schemaContext,
  "@type": "Movie",
  name: movie.title,
  description: movie.description,
  image: toAbsoluteUrl(movie.posterUrl),
  datePublished: `${movie.year}-01-01`,
  genre: movie.genres,
  duration: formatDuration(movie.durationMins),
  aggregateRating: ratingValue(movie.rating),
  url: buildCanonical(`/detail/${movie.slug}`),
});

export const tvSeriesJsonLd = (series: CatalogSeries) => ({
  "@context": schemaContext,
  "@type": "TVSeries",
  name: series.title,
  description: series.description,
  image: toAbsoluteUrl(series.posterUrl),
  startDate: `${series.year}-01-01`,
  genre: series.genres,
  aggregateRating: ratingValue(series.rating),
  url: buildCanonical(`/detail/${series.slug}`),
});

export const episodeJsonLd = (episode: CatalogEpisode, series: CatalogSeries) => ({
  "@context": schemaContext,
  "@type": "Episode",
  name: episode.title,
  episodeNumber: episode.episodeNumber,
  seasonNumber: episode.seasonNumber,
  datePublished: episode.airDate,
  partOfSeries: {
    "@type": "TVSeries",
    name: series.title,
    url: buildCanonical(`/detail/${series.slug}`),
  },
});
