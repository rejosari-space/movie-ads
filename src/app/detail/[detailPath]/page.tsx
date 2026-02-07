import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import RelatedTitles from "@/components/seo/RelatedTitles";
import DetailClient from "@/components/pages/DetailClient";
import { allTitles, getTitleBySlug } from "@/content/catalog";
import { apiServer } from "@/lib/api/server";
import { breadcrumbJsonLd, episodeJsonLd, movieJsonLd, tvSeriesJsonLd } from "@/lib/seo/jsonld";
import { buildCanonical, toAbsoluteUrl } from "@/lib/seo/urls";

type DetailPageParams = {
  detailPath: string;
};

type DetailPageProps = {
  params: DetailPageParams | Promise<DetailPageParams>;
};

const buildTitle = (detailPath: string) => {
  let decoded = detailPath;
  try {
    decoded = decodeURIComponent(detailPath);
  } catch {
    decoded = detailPath;
  }

  const cleaned = decoded.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) return "Detail";
  const lowered = cleaned.toLowerCase();
  if (lowered === "undefined" || lowered === "null") return "Detail";
  return cleaned;
};

const formatGenreLabel = (genre?: string) => {
  if (!genre) return "Kategori";
  return genre
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export async function generateStaticParams() {
  return allTitles.map((item) => ({ detailPath: item.slug }));
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { detailPath } = await params;
  const appName = process.env.APP_NAME || process.env.NEXT_PUBLIC_APP_NAME || "Rebahan";
  const decodedPath = decodeURIComponent(detailPath);
  const encodedPath = encodeURIComponent(decodedPath);
  const catalogItem = getTitleBySlug(decodedPath);
  let title = buildTitle(detailPath);
  let description = title === "Detail" ? `Streaming detail page on ${appName}.` : `Watch ${title} on ${appName}.`;
  let ogImage: string | undefined;
  let canonical = buildCanonical(`/detail/${encodedPath}`);

  if (catalogItem) {
    title = `${catalogItem.title} | ${appName}`;
    description = catalogItem.description;
    ogImage = toAbsoluteUrl(catalogItem.posterUrl);
    canonical = buildCanonical(`/detail/${catalogItem.slug}`);
  }

  try {
    if (!catalogItem) {
      const data = await apiServer.getDetail(decodedPath);
      const apiTitle = data?.data?.title;
      if (apiTitle) {
        title = `${apiTitle} | ${appName}`;
        description = data?.data?.description || data?.data?.plot || `Watch ${apiTitle} on ${appName}.`;
        ogImage = data?.data?.poster ? toAbsoluteUrl(data.data.poster) : ogImage;
      }
    }
  } catch {
    // ignore metadata fetch errors
  }

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

const normalizeDetail = (value: any) => {
  if (!value || typeof value !== "object") return null;
  if (!value.title) return null;
  return value;
};

const DetailPage = async ({ params }: DetailPageProps) => {
  const { detailPath } = await params;
  const decodedPath = decodeURIComponent(detailPath);
  const catalogItem = getTitleBySlug(decodedPath);
  if (catalogItem?.status === "removed") {
    notFound();
  }

  let initialDetail = null;
  let initialRecommendations: any[] = [];
  let shouldNotFound = false;

  try {
    const detailResponse = await apiServer.getDetail(decodedPath);
    const candidate = detailResponse?.data || detailResponse?.items?.[0] || null;
    initialDetail = normalizeDetail(candidate);
    if (!initialDetail && (detailResponse?.error || detailResponse?.message)) {
      shouldNotFound = true;
    }
  } catch {
    initialDetail = null;
  }

  try {
    const trending = await apiServer.getTrending(1);
    const items = trending?.data || trending?.items || [];
    initialRecommendations = Array.isArray(items) ? items.slice(0, 10) : [];
  } catch {
    initialRecommendations = [];
  }

  if (shouldNotFound && !catalogItem) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", url: buildCanonical("/") },
  ];
  const breadcrumbLinks: Array<{ label: string; href?: string }> = [
    { label: "Home", href: "/" },
  ];

  if (catalogItem?.genres?.length) {
    const primaryGenre = catalogItem.genres[0];
    breadcrumbItems.push({
      name: formatGenreLabel(primaryGenre),
      url: buildCanonical(`/category/${primaryGenre}`),
    });
    breadcrumbLinks.push({
      label: formatGenreLabel(primaryGenre),
      href: `/category/${primaryGenre}`,
    });
  }

  const displayTitle = catalogItem?.title || initialDetail?.title || buildTitle(detailPath);
  breadcrumbItems.push({ name: displayTitle, url: buildCanonical(`/detail/${encodeURIComponent(decodedPath)}`) });
  breadcrumbLinks.push({ label: displayTitle });

  const jsonLdBlocks: Record<string, unknown>[] = [breadcrumbJsonLd(breadcrumbItems)];

  if (catalogItem?.kind === "movie") {
    jsonLdBlocks.push(movieJsonLd(catalogItem));
  }

  if (catalogItem?.kind === "series") {
    jsonLdBlocks.push(tvSeriesJsonLd(catalogItem));
    catalogItem.seasons.forEach((season) => {
      season.episodes.forEach((episode) => {
        jsonLdBlocks.push(episodeJsonLd(episode, catalogItem));
      });
    });
  }

  if (!catalogItem && initialDetail?.title) {
    const inferredSeries = Boolean(initialDetail?.seasons?.length || initialDetail?.episodes?.length);
    const baseJsonLd = {
      "@context": "https://schema.org",
      "@type": inferredSeries ? "TVSeries" : "Movie",
      name: initialDetail.title,
      description: initialDetail.description || initialDetail.plot,
      image: initialDetail.poster ? toAbsoluteUrl(initialDetail.poster) : undefined,
      url: buildCanonical(`/detail/${encodeURIComponent(decodedPath)}`),
    };
    jsonLdBlocks.push(baseJsonLd);
  }

  return (
    <>
      {jsonLdBlocks.map((block, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
      <div className="container">
        <Breadcrumbs items={breadcrumbLinks} />
      </div>
      <DetailClient
        detailPath={detailPath}
        initialDetail={initialDetail}
        initialRecommendations={initialRecommendations}
        initialDetailPath={detailPath}
      />
      {catalogItem && <RelatedTitles slug={catalogItem.slug} />}
    </>
  );
};

export default DetailPage;
