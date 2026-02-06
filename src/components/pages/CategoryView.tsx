import Link from "next/link";
import MovieCard from "@/components/common/MovieCard";

type CategoryViewProps = {
  activeCategory: string;
  items: any[];
  hasMore: boolean;
  page: number;
  basePath: string;
};

const categories = [
  { id: "trending", name: "Trending" },
  { id: "indonesian-movies", name: "Film Indonesia" },
  { id: "indonesian-drama", name: "Drama Indonesia" },
  { id: "kdrama", name: "K-Drama" },
  { id: "short-tv", name: "Short TV" },
  { id: "anime", name: "Anime" },
  { id: "adult-comedy", name: "Canda Dewasa" },
  { id: "western-tv", name: "Western TV" },
  { id: "indo-dub", name: "Indo Dub" },
];

const CategoryView = ({ activeCategory, items, hasMore, page, basePath }: CategoryViewProps) => {
  const currentCategoryName =
    categories.find((c) => c.id === activeCategory)?.name || activeCategory;

  return (
    <div className="container categoryPage">
      <h1 className="categoryTitle">{currentCategoryName}</h1>

      <div className="categoryTabs">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className={`categoryTab ${isActive ? "active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>

      {items.length === 0 ? (
        <p style={{ textAlign: "center", margin: "40px", color: "var(--text-secondary)" }}>
          No content available.
        </p>
      ) : (
        <div className="grid">
          {items.map((item, index) => (
            <MovieCard key={`${item.id}-${index}`} movie={item} />
          ))}
        </div>
      )}

      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link
            href={`${basePath}?page=${page + 1}`}
            className="btn btn-primary"
            style={{ display: "inline-block" }}
          >
            Load More
          </Link>
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <p style={{ textAlign: "center", margin: "20px", color: "var(--text-secondary)" }}>
          You've reached the end.
        </p>
      )}
    </div>
  );
};

export default CategoryView;
