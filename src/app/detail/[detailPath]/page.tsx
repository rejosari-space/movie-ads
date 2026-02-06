import type { Metadata } from "next";
import DetailClient from "@/components/pages/DetailClient";
import { apiServer } from "@/lib/api/server";

type DetailPageProps = {
  params: {
    detailPath: string;
  };
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

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const decodedPath = decodeURIComponent(params.detailPath);
  const appName = process.env.APP_NAME || process.env.NEXT_PUBLIC_APP_NAME || "Rebahan";
  let title = buildTitle(params.detailPath);
  let description =
    title === "Detail"
      ? `Streaming detail page on ${appName}.`
      : `Watch ${title} on ${appName}.`;

  try {
    const data = await apiServer.getDetail(decodedPath);
    const apiTitle = data?.data?.title;
    if (apiTitle) {
      title = `${apiTitle} | ${appName}`;
      description =
        data?.data?.description || data?.data?.plot || `Watch ${apiTitle} on ${appName}.`;
    }
  } catch {
    // ignore metadata fetch errors
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

const DetailPage = async ({ params }: DetailPageProps) => {
  const decodedPath = decodeURIComponent(params.detailPath);
  let initialDetail = null;
  let initialRecommendations: any[] = [];

  try {
    const detailResponse = await apiServer.getDetail(decodedPath);
    initialDetail = detailResponse?.data || detailResponse?.items?.[0] || detailResponse || null;
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

  return (
    <DetailClient
      detailPath={params.detailPath}
      initialDetail={initialDetail}
      initialRecommendations={initialRecommendations}
      initialDetailPath={params.detailPath}
    />
  );
};

export default DetailPage;
