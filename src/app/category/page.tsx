import type { Metadata } from "next";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import CategoryView from "@/components/pages/CategoryView";
import { getDefaultOgImage } from "@/content/catalog";
import { apiServer } from "@/lib/api/server";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { buildCanonical, toAbsoluteUrl } from "@/lib/seo/urls";

const appName = process.env.APP_NAME || process.env.NEXT_PUBLIC_APP_NAME || "Rebahan";

const parsePageValue = (value?: string | string[]) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw ?? "1") || 1;
  return page < 1 ? 1 : page;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { page?: string } | Promise<{ page?: string }>;
}): Promise<Metadata> {
  const title = `Trending | ${appName}`;
  const description = `Browse trending movies and series on ${appName}.`;
  const resolvedSearchParams = await searchParams;
  const page = parsePageValue(resolvedSearchParams?.page);
  const canonical = buildCanonical("/category");
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

type CategoryIndexPageProps = {
  searchParams?: { page?: string } | Promise<{ page?: string }>;
};

const CategoryIndexPage = async ({ searchParams }: CategoryIndexPageProps) => {
  const resolvedSearchParams = await searchParams;
  const page = parsePageValue(resolvedSearchParams?.page);
  let items: any[] = [];
  let hasMore = false;

  try {
    const res = await apiServer.getTrending(page);
    items = res?.items || [];
    hasMore = res?.hasMore !== false;
  } catch {
    items = [];
    hasMore = false;
  }

  const breadcrumbItems = [
    { name: "Home", url: buildCanonical("/") },
    { name: "Trending", url: buildCanonical("/category") },
  ];
  const breadcrumbLd = breadcrumbJsonLd(breadcrumbItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="container">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Trending" }]} />
      </div>
      <CategoryView
        activeCategory="trending"
        items={items}
        hasMore={hasMore}
        page={page}
        basePath="/category"
      />
    </>
  );
};

export default CategoryIndexPage;
