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
  const trimmedQuery = query.trim();

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    if (!trimmedQuery) {
      setResults([]);
      setLoading(false);
      return () => {
        isActive = false;
      };
    }

    const fetchSearch = async () => {
      setLoading(true);
      setResults([]);
      try {
        const res = await api.search(trimmedQuery);
        if (isActive) {
          setResults(res.items || []);
        }
      } catch (e) {
        console.error("Search failed", e);
        if (isActive) {
          setResults([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchSearch();
    return () => {
      isActive = false;
    };
  }, [trimmedQuery]);

  return (
    <div className="container" style={{ paddingTop: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>
        {trimmedQuery ? `Search Results for: "${trimmedQuery}"` : "Search"}
      </h1>

      {loading ? (
        <SectionSkeleton />
      ) : (
        <div className="grid">
          {results.length > 0 ? (() => {
            const cards = results.map((item, index) => (
              <MovieCard key={`${item.detailPath ?? item.id ?? "item"}-${index}`} movie={item} />
            ));
            if (results.length >= 5) {
              cards.splice(
                5,
                0,
                <AdSlot key="infeed-banner-search" slot="INFEED_BANNER" className="ad-infeed grid-ad" />
              );
            }
            return cards;
          })() : (
            <p style={{ color: "var(--text-secondary)" }}>
              {trimmedQuery ? "No results found." : "Type a keyword to search."}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchClient;
