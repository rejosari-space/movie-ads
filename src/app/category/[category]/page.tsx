import type { Metadata } from "next";
import CategoryView from "@/components/pages/CategoryView";
import { apiServer } from "@/lib/api/server";

type CategoryPageProps = {
  params: {
    category: string;
  };
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

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const appName = process.env.APP_NAME || process.env.NEXT_PUBLIC_APP_NAME || "Rebahan";
  const label = formatCategory(params.category);
  const title = `${label} | ${appName}`;
  const description = `Browse ${label} content on ${appName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

type CategoryPageRouteProps = CategoryPageProps & {
  searchParams?: { page?: string };
};

const CategoryPage = async ({ params, searchParams }: CategoryPageRouteProps) => {
  const rawPage = searchParams?.page;
  const pageValue = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const page = Number(pageValue ?? "1") || 1;
  const category = params.category;
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

  return (
    <CategoryView
      activeCategory={category}
      items={items}
      hasMore={hasMore}
      page={page}
      basePath={`/category/${category}`}
    />
  );
};

export default CategoryPage;
