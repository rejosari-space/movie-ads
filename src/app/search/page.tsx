import MovieCard from "@/components/common/MovieCard";
import { apiServer } from "@/lib/api/server";

type SearchPageProps = {
  searchParams?: { q?: string };
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const rawQuery = searchParams?.q;
  const query = Array.isArray(rawQuery) ? rawQuery[0] ?? "" : rawQuery?.toString() ?? "";
  let results: any[] = [];

  if (query) {
    try {
      const res = await apiServer.search(query);
      results = res?.items || [];
    } catch {
      results = [];
    }
  }

  return (
    <div className="container" style={{ paddingTop: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>
        Search Results for: "{query}"
      </h1>

      {results.length > 0 ? (
        <div className="grid">
          {results.map((item) => (
            <MovieCard key={item.id} movie={item} />
          ))}
        </div>
      ) : (
        <p style={{ color: "var(--text-secondary)" }}>
          {query ? "No results found." : "Type a keyword to search."}
        </p>
      )}
    </div>
  );
};

export default SearchPage;
