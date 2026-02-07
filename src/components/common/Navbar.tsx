"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { api } from "@/services/api";

type SuggestionItem = {
  id?: string | number;
  title?: string;
  poster?: string;
  posterUrl?: string;
  detailPath?: string;
  year?: string | number;
  type?: string;
};

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const router = useRouter();

  const performSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const toggleSearch = () => {
    if (isSearchOpen) {
      if (searchQuery.trim()) {
        performSearch();
        return;
      }
      setIsSearchOpen(false);
      setSuggestions([]);
      return;
    }

    setIsSearchOpen(true);
    setTimeout(() => document.querySelector<HTMLInputElement>(".searchInput")?.focus(), 100);
  };

  const trimmedQuery = useMemo(() => searchQuery.trim(), [searchQuery]);

  useEffect(() => {
    let isActive = true;

    if (!isSearchOpen || trimmedQuery.length < 2) {
      setSuggestions([]);
      setIsSuggesting(false);
      return () => {
        isActive = false;
      };
    }

    const timeout = setTimeout(async () => {
      setIsSuggesting(true);
      try {
        const res = await api.search(trimmedQuery);
        if (!isActive) return;
        const items = Array.isArray(res.items) ? (res.items as SuggestionItem[]) : [];
        const unique = new Map<string, SuggestionItem>();
        items.forEach((item) => {
          const key = item.detailPath || (item.id ? String(item.id) : "") || item.title || "";
          if (!key || unique.has(key)) return;
          unique.set(key, item);
        });
        setSuggestions(Array.from(unique.values()).slice(0, 6));
      } catch (e) {
        console.error("Search suggestions failed", e);
        if (isActive) {
          setSuggestions([]);
        }
      } finally {
        if (isActive) {
          setIsSuggesting(false);
        }
      }
    }, 250);

    return () => {
      isActive = false;
      clearTimeout(timeout);
    };
  }, [trimmedQuery, isSearchOpen]);

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Rebahan";

  return (
    <nav className="navbar">
      <Link href="/" className="logo">
        <Image
          src="/logo.svg"
          alt={appName}
          className="navbar-logo-img"
          width={40}
          height={40}
          priority
        />
        <span>{appName}</span>
      </Link>

      <div className={`navLinks ${isMobileMenuOpen ? "open" : ""}`}>
        <Link href="/" className="navLink">
          Home
        </Link>
        <Link href="/categories" className="navLink">
          All Categories
        </Link>
        <Link href="/category/kdrama" className="navLink">
          K-Drama
        </Link>
        <Link href="/category/short-tv" className="navLink">
          Short TV
        </Link>
        <Link href="/category/anime" className="navLink">
          Anime
        </Link>
        <Link href="/category/western-tv" className="navLink">
          Western TV
        </Link>
        <Link href="/category/indo-dub" className="navLink">
          Indo Dub
        </Link>
      </div>

      <div className="rightSection">
        <div className="searchWrapper">
          <form className={`searchContainer ${isSearchOpen ? "active" : ""}`} onSubmit={handleSearchSubmit}>
            <button type="button" className="iconButton" onClick={toggleSearch}>
              <Search size={20} />
            </button>
            <input
              type="text"
              className={`searchInput ${isSearchOpen ? "open" : ""}`}
              placeholder="Titles, people, genres"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          {isSearchOpen && trimmedQuery && (
            <div className="searchSuggestions" role="listbox" aria-label="Search suggestions">
              <button type="button" className="searchSuggestion searchSuggestion--action" onClick={performSearch}>
                <Search size={16} />
                <span>Search for "{trimmedQuery}"</span>
              </button>
              {isSuggesting && (
                <div className="searchSuggestion searchSuggestion--status">Searching...</div>
              )}
              {!isSuggesting && suggestions.length === 0 && trimmedQuery.length >= 2 && (
                <div className="searchSuggestion searchSuggestion--status">No suggestions found.</div>
              )}
              {suggestions.map((item) => {
                if (!item.detailPath) return null;
                const detailSlug = encodeURIComponent(item.detailPath);
                const posterSrc = item.posterUrl || item.poster || "/placeholder-poster.svg";
                return (
                  <Link
                    key={item.detailPath}
                    href={`/detail/${detailSlug}`}
                    className="searchSuggestion"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      setSuggestions([]);
                    }}
                  >
                    <span className="searchSuggestionPoster">
                      <Image src={posterSrc} alt={item.title || "Poster"} width={44} height={66} />
                    </span>
                    <span className="searchSuggestionMeta">
                      <span className="searchSuggestionTitle">{item.title || "Untitled"}</span>
                      <span className="searchSuggestionSub">
                        {item.year ? item.year : "Unknown year"}
                        {item.type ? ` • ${item.type}` : ""}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <button className="iconButton mobileMenuBtn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
