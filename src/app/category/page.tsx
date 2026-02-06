import type { Metadata } from "next";
import CategoryView from "@/components/pages/CategoryView";
import { apiServer } from "@/lib/api/server";

const appName = process.env.APP_NAME || process.env.NEXT_PUBLIC_APP_NAME || "Rebahan";

export const metadata: Metadata = {
  title: `Trending | ${appName}`,
  description: `Browse trending movies and series on ${appName}.`,
};

type CategoryIndexPageProps = {
  searchParams?: { page?: string };
};

const CategoryIndexPage = async ({ searchParams }: CategoryIndexPageProps) => {
  const rawPage = searchParams?.page;
  const pageValue = Array.isArray(rawPage) ? rawPage[0] : rawPage;
  const page = Number(pageValue ?? "1") || 1;
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

  return (
    <CategoryView
      activeCategory="trending"
      items={items}
      hasMore={hasMore}
      page={page}
      basePath="/category"
    />
  );
};

export default CategoryIndexPage;
