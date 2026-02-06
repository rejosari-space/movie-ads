import { getLatestTitles } from "@/content/catalog";
import { buildCanonical } from "@/lib/seo/urls";

const appName = process.env.APP_NAME || process.env.NEXT_PUBLIC_APP_NAME || "Rebahan";

const escapeCdata = (value: string) => value.replace(/]]>/g, "]]]]><![CDATA[>");

export async function GET() {
  const siteUrl = buildCanonical("/");
  const items = getLatestTitles(20)
    .map((item) => {
      const link = buildCanonical(`/detail/${item.slug}`);
      const pubDate = new Date(item.updatedAt ?? `${item.year}-01-01`).toUTCString();
      return `
  <item>
    <title><![CDATA[${escapeCdata(item.title)}]]></title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <description><![CDATA[${escapeCdata(item.description)}]]></description>
    <pubDate>${pubDate}</pubDate>
  </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title><![CDATA[${escapeCdata(appName)}]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[Update terbaru film dan series di ${escapeCdata(appName)}]]></description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
