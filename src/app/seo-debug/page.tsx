import { notFound } from "next/navigation";
import { allTitles } from "@/content/catalog";
import { websiteJsonLd, movieJsonLd, tvSeriesJsonLd } from "@/lib/seo/jsonld";
import { buildCanonical } from "@/lib/seo/urls";
import robots from "@/app/robots";

const SeoDebugPage = () => {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const sampleItem = allTitles[0];
  const homeCanonical = buildCanonical("/");
  const categoryCanonical = buildCanonical("/category/anime");
  const detailCanonical = sampleItem ? buildCanonical(`/detail/${sampleItem.slug}`) : "";
  const robotsConfig = robots();

  const websiteLd = websiteJsonLd(process.env.APP_NAME || process.env.NEXT_PUBLIC_APP_NAME || "Rebahan");
  const movieLd = sampleItem?.kind === "movie" ? movieJsonLd(sampleItem) : null;
  const seriesLd = sampleItem?.kind === "series" ? tvSeriesJsonLd(sampleItem) : null;

  return (
    <div className="container" style={{ padding: "30px 0 60px" }}>
      <h1 style={{ marginBottom: "10px" }}>SEO Debug (Dev Only)</h1>
      <p style={{ color: "var(--text-secondary)" }}>
        Halaman ini hanya tampil di development untuk memeriksa canonical, robots, dan JSON-LD.
      </p>

      <section style={{ marginTop: "24px" }}>
        <h2>Canonical Samples</h2>
        <ul>
          <li>Home: {homeCanonical}</li>
          <li>Category: {categoryCanonical}</li>
          <li>Detail: {detailCanonical}</li>
        </ul>
      </section>

      <section style={{ marginTop: "24px" }}>
        <h2>Robots Rules</h2>
        <pre style={{ whiteSpace: "pre-wrap", background: "#111", padding: "12px", borderRadius: "6px" }}>
{JSON.stringify(robotsConfig, null, 2)}
        </pre>
      </section>

      <section style={{ marginTop: "24px" }}>
        <h2>JSON-LD Presence</h2>
        <ul>
          <li>WebSite: {websiteLd ? "yes" : "no"}</li>
          <li>Movie: {movieLd ? "yes" : "no"}</li>
          <li>TVSeries: {seriesLd ? "yes" : "no"}</li>
        </ul>
      </section>
    </div>
  );
};

export default SeoDebugPage;
