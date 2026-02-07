import type { Metadata } from "next";
import AdSlot from "@/components/ads/AdSlot";
import MovieCard from "@/components/common/MovieCard";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { getDefaultOgImage } from "@/content/catalog";
import { apiServer } from "@/lib/api/server";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildCanonical, toAbsoluteUrl } from "@/lib/seo/urls";

type SearchPageProps = {
  searchParams?: { q?: string } | Promise<{ q?: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const appName = process.env.APP_NAME || process.env.NEXT_PUBLIC_APP_NAME || "Rebahan";
  const resolvedSearchParams = await searchParams;
  const rawQuery = resolvedSearchParams?.q;
  const query = Array.isArray(rawQuery) ? rawQuery[0] ?? "" : rawQuery?.toString() ?? "";
  const trimmedQuery = query.trim();
  const title = trimmedQuery ? `Search: ${trimmedQuery} | ${appName}` : `Search | ${appName}`;
  const description = `Cari film dan series di ${appName}.`;
  const canonical = buildCanonical("/search");
  const ogImage = toAbsoluteUrl(getDefaultOgImage());

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const resolvedSearchParams = await searchParams;
  const rawQuery = resolvedSearchParams?.q;
  const query = Array.isArray(rawQuery) ? rawQuery[0] ?? "" : rawQuery?.toString() ?? "";
  const trimmedQuery = query.trim();
  let results: any[] = [];

  if (trimmedQuery) {
    try {
      const res = await apiServer.search(trimmedQuery);
      results = res?.items || [];
    } catch {
      results = [];
    }
  }

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", url: buildCanonical("/") },
    { name: "Search", url: buildCanonical("/search") },
  ]);

  const resultsGrid = results.length > 0 ? (() => {
    const cards = results.map((item, index) => (
      <MovieCard key={`${item.detailPath ?? item.id ?? "item"}-${index}`} movie={item} />
    ));
    if (results.length >= 5) {
      cards.splice(
        5,
        0,
        <AdSlot key="infeed-banner-search" slot="INFEED_BANNER" className="ad-infeed grid-ad" />
      );
    }
    return cards;
  })() : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="container">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      </div>
      <div className="container" style={{ paddingTop: "10px" }}>
        <h1 style={{ marginBottom: "20px" }}>
          {trimmedQuery ? `Search Results for: "${trimmedQuery}"` : "Search"}
        </h1>

        {resultsGrid ? (
          <div className="grid">{resultsGrid}</div>
        ) : (
          <p style={{ color: "var(--text-secondary)" }}>
            {trimmedQuery ? "No results found." : "Type a keyword to search."}
          </p>
        )}
      </div>
    </>
  );
};

export default SearchPage;
