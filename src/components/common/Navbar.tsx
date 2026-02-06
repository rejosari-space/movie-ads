"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, X } from "lucide-react";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const performSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    if (!isSearchOpen) {
      setTimeout(() => document.querySelector<HTMLInputElement>(".searchInput")?.focus(), 100);
    }
  };

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Rebahan";

  return (
    <nav className="navbar">
      <Link href="/" className="logo">
        <Image
          src="/logo.png"
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
        <div style={{ position: "relative" }}>
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
        </div>

        <button className="iconButton mobileMenuBtn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
