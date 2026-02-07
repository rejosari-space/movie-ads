import type { Metadata } from "next";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import CategoryView from "@/components/pages/CategoryView";
import { getDefaultOgImage } from "@/content/catalog";
import { apiServer } from "@/lib/api/server";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildCanonical, toAbsoluteUrl } from "@/lib/seo/urls";

type CategoryPageProps = {
  params:
    | {
        category: string;
      }
    | Promise<{
        category: string;
      }>;
};

const categoryLabels: Record<string, string> = {
  trending: "Trending",
  "indonesian-movies": "Film Indonesia",
  "indonesian-drama": "Drama Indonesia",
  kdrama: "K-Drama",
  "short-tv": "Short TV",
  anime: "Anime",
  "adult-comedy": "Canda Dewasa",
  "western-tv": "Western TV",
  "indo-dub": "Indo Dub",
};

const formatCategory = (category: string) => {
  const label = categoryLabels[category];
  if (label) return label;

  let decoded = category;
  try {
    decoded = decodeURIComponent(category);
  } catch {
    decoded = category;
  }

  const cleaned = decoded.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) return "Category";
  const lowered = cleaned.toLowerCase();
  if (lowered === "undefined" || lowered === "null") return "Category";
  return cleaned;
};

const parsePageValue = (value?: string | string[]) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw ?? "1") || 1;
  return page < 1 ? 1 : page;
};

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps & {
  searchParams?: { page?: string } | Promise<{ page?: string }>;
}): Promise<Metadata> {
  const appName = process.env.APP_NAME || process.env.NEXT_PUBLIC_APP_NAME || "Rebahan";
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const label = formatCategory(resolvedParams.category);
  const title = `${label} | ${appName}`;
  const description = `Browse ${label} content on ${appName}.`;
  const page = parsePageValue(resolvedSearchParams?.page);
  const canonicalBase = buildCanonical(`/category/${resolvedParams.category}`);
  const canonical = page > 1 ? canonicalBase : canonicalBase;
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
      index: page === 1,
      follow: true,
    },
  };
}

type CategoryPageRouteProps = CategoryPageProps & {
  searchParams?: { page?: string } | Promise<{ page?: string }>;
};

const CategoryPage = async ({ params, searchParams }: CategoryPageRouteProps) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = parsePageValue(resolvedSearchParams?.page);
  const category = resolvedParams.category;
  let items: any[] = [];
  let hasMore = false;

  try {
    if (category === "trending") {
      const res = await apiServer.getTrending(page);
      items = res?.items || [];
      hasMore = res?.hasMore !== false;
    } else {
      const res = await apiServer.getCategory(category, page);
      items = res?.items || [];
      hasMore = res?.hasMore !== false;
    }
  } catch {
    items = [];
    hasMore = false;
  }

  const label = formatCategory(category);
  const breadcrumbItems = [
    { name: "Home", url: buildCanonical("/") },
    { name: label, url: buildCanonical(`/category/${category}`) },
  ];
  const breadcrumbLd = breadcrumbJsonLd(breadcrumbItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="container">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: label },
          ]}
        />
      </div>
      <CategoryView
        activeCategory={category}
        items={items}
        hasMore={hasMore}
        page={page}
        basePath={`/category/${category}`}
      />
    </>
  );
};

export default CategoryPage;
