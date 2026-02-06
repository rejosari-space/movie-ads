import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AdScripts from "@/components/ads/AdScripts";
import AdSlot from "@/components/ads/AdSlot";
import AdblockGate from "@/components/adblock/AdblockGate";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import { buildCanonical, getSiteOrigin } from "@/lib/seo/urls";

const siteOrigin = getSiteOrigin();
const appName = process.env.APP_NAME || process.env.NEXT_PUBLIC_APP_NAME || "Rebahan";
const siteDescription = `${appName} adalah hub streaming film dan series dengan koleksi pilihan dan update terbaru.`;
const defaultCanonical = buildCanonical("/");

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: siteDescription,
  alternates: {
    canonical: defaultCanonical,
  },
  openGraph: {
    title: appName,
    description: siteDescription,
    url: defaultCanonical,
    siteName: appName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: appName,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <AdScripts />
        <Navbar />
        <div className="layout-ads">
          <AdSlot slot="HEADER" className="ad-header" />
        </div>
        <main className="main-content">{children}</main>
        <Footer />
        <AdblockGate />
      </body>
    </html>
  );
}
