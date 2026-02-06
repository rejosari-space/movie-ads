import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AdScripts from "@/components/ads/AdScripts";
import AdSlot from "@/components/ads/AdSlot";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const appName = process.env.APP_NAME || process.env.NEXT_PUBLIC_APP_NAME || "Rebahan";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description:
    `${appName} is a streaming hub for movies and TV series, powered by third-party APIs.`,
  openGraph: {
    title: appName,
    description:
      `${appName} is a streaming hub for movies and TV series, powered by third-party APIs.`,
    url: siteUrl,
    siteName: appName,
    type: "website",
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
    <html lang="en">
      <body>
        <AdScripts />
        <Navbar />
        <div className="layout-ads">
          <AdSlot slot="HEADER" className="ad-header" />
        </div>
        <main className="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
