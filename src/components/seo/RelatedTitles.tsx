import MovieCard from "@/components/common/MovieCard";
import { getRelatedTitles } from "@/content/catalog";

type RelatedTitlesProps = {
  slug: string;
  title?: string;
};

const RelatedTitles = ({ slug, title }: RelatedTitlesProps) => {
  const related = getRelatedTitles(slug, 6);
  if (related.length === 0) return null;

  return (
    <section className="section related-section">
      <div className="container">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Related Titles{title ? `: ${title}` : ""}</h2>
        </div>
        <div className="grid">
          {related.map((item) => (
            <MovieCard
              key={item.slug}
              movie={{
                id: item.slug,
                detailPath: item.slug,
                poster: item.posterUrl,
                title: item.title,
                rating: item.rating,
                year: item.year,
                type: item.kind === "series" ? "Series" : "Movie",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedTitles;
