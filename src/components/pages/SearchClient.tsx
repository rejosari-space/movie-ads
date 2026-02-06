"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdSlot from "@/components/ads/AdSlot";
import MovieCard from "@/components/common/MovieCard";
import { SectionSkeleton } from "@/components/common/Skeleton";
import { api } from "@/services/api";

const SearchClient = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      const fetchSearch = async () => {
        setLoading(true);
        try {
          const res = await api.search(query);
          setResults(res.items || []);
        } catch (e) {
          console.error("Search failed", e);
        } finally {
          setLoading(false);
        }
      };

      fetchSearch();
    }
  }, [query]);

  return (
    <div className="container" style={{ paddingTop: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Search Results for: "{query}"</h1>

      {loading ? (
        <SectionSkeleton />
      ) : (
        <div className="grid">
          {results.length > 0 ? (() => {
            const cards = results.map((item) => <MovieCard key={item.id} movie={item} />);
            if (results.length >= 5) {
              cards.splice(
                5,
                0,
                <AdSlot key="infeed-banner-search" slot="INFEED_BANNER" className="ad-infeed grid-ad" />
              );
            }
            return cards;
          })() : (
            <p style={{ color: "var(--text-secondary)" }}>No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchClient;
