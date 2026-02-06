import type { Metadata } from "next";
import DetailClient from "@/components/pages/DetailClient";
import { buildCanonical } from "@/lib/seo/urls";

const appName = process.env.APP_NAME || process.env.NEXT_PUBLIC_APP_NAME || "Rebahan";

export const metadata: Metadata = {
  title: `Detail | ${appName}`,
  description: `Streaming detail page on ${appName}.`,
  alternates: { canonical: buildCanonical("/detail") },
  robots: {
    index: false,
    follow: true,
  },
};

const DetailIndexPage = () => {
  return <DetailClient detailPath={null} />;
};

export default DetailIndexPage;
