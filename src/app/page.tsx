import type { Metadata } from "next";
import HomeClient from "@/components/pages/HomeClient";
import { apiServer } from "@/lib/api/server";
import { getDefaultOgImage } from "@/content/catalog";
import { websiteJsonLd } from "@/lib/seo/jsonld";
import { buildCanonical, toAbsoluteUrl } from "@/lib/seo/urls";

const appName = process.env.APP_NAME || process.env.NEXT_PUBLIC_APP_NAME || "Rebahan";
const description =
  `${appName} adalah hub streaming film dan series dengan koleksi pilihan dan update terbaru.`;
const canonical = buildCanonical("/");
const ogImage = toAbsoluteUrl(getDefaultOgImage());

export const metadata: Metadata = {
  title: appName,
  description,
  alternates: { canonical },
  openGraph: {
    type: "website",
    url: canonical,
    title: appName,
    description,
    images: [{ url: ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: appName,
    description,
    images: [ogImage],
  },
};

const HomePage = async () => {
  const sections = {
    kDrama: { title: "K-Drama", data: [] as any[], loading: false, link: "/category/kdrama" },
    shortTv: { title: "Short TV", data: [] as any[], loading: false, link: "/category/short-tv" },
    anime: { title: "Anime", data: [] as any[], loading: false, link: "/category/anime" },
    westernTv: { title: "Western TV", data: [] as any[], loading: false, link: "/category/western-tv" },
    indoDub: { title: "Indo Dub", data: [] as any[], loading: false, link: "/category/indo-dub" },
  };

  let trending: any[] = [];

  try {
    const [
      trendingRes,
      kdramaRes,
      shortTvRes,
      animeRes,
      westernRes,
      indoRes,
    ] = await Promise.all([
      apiServer.getTrending(1),
      apiServer.getCategory("kdrama", 1),
      apiServer.getCategory("short-tv", 1),
      apiServer.getCategory("anime", 1),
      apiServer.getCategory("western-tv", 1),
      apiServer.getCategory("indo-dub", 1),
    ]);

    trending = trendingRes?.items || [];
    sections.kDrama.data = kdramaRes?.items || [];
    sections.shortTv.data = shortTvRes?.items || [];
    sections.anime.data = animeRes?.items || [];
    sections.westernTv.data = westernRes?.items || [];
    sections.indoDub.data = indoRes?.items || [];
  } catch {
    // keep empty data if fetch fails
  }

  const hasData =
    trending.length > 0 ||
    Object.values(sections).some((section) => Array.isArray(section.data) && section.data.length > 0);

  const jsonLd = websiteJsonLd(appName);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient trending={trending} sections={sections} hasData={hasData} />
    </>
  );
};

export default HomePage;
