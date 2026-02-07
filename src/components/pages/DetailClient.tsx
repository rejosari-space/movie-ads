"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Calendar, Film, Star } from "lucide-react";
import AdSlot from "@/components/ads/AdSlot";
import MovieCard from "@/components/common/MovieCard";
import DetailSkeleton from "@/components/common/DetailSkeleton";
import VideoPlayer from "@/components/player/VideoPlayer";
import { triggerPopunder } from "@/lib/ads/popunder";

type DetailClientProps = {
  detailPath?: string | null;
  initialDetail?: any | null;
  initialRecommendations?: any[];
  initialDetailPath?: string | null;
};

const isValidDetail = (value: any) => {
  if (!value || typeof value !== "object") return false;
  if (!value.title) return false;
  return true;
};

const DetailClient = ({
  detailPath,
  initialDetail = null,
  initialRecommendations = [],
  initialDetailPath = null,
}: DetailClientProps) => {
  const params = useParams();
  const paramDetailPath = Array.isArray(params?.detailPath)
    ? params?.detailPath?.[0]
    : (params?.detailPath as string | undefined);
  const resolvedDetailPath = detailPath ?? paramDetailPath ?? null;

  const [detail, setDetail] = useState<any>(isValidDetail(initialDetail) ? initialDetail : null);
  const [loading, setLoading] = useState(!isValidDetail(initialDetail));
  const [error, setError] = useState<string | null>(null);
  const [activeSeason, setActiveSeason] = useState(1);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>(initialRecommendations);
  const lastFetchRef = useRef<string | null>(null);

  const hasInitial = Boolean(initialDetail) && initialDetailPath === resolvedDetailPath;

  useEffect(() => {
    if (hasInitial) {
      if (isValidDetail(initialDetail)) {
        setDetail(initialDetail);
        setError(null);
      }
      setRecommendations(initialRecommendations);
      setLoading(false);
    }
  }, [hasInitial, initialDetail, initialRecommendations]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!resolvedDetailPath) {
      setError("Detail tidak ditemukan.");
    }
  }, [resolvedDetailPath, initialDetail]);

  useEffect(() => {
    if (!resolvedDetailPath) return;
    if (isValidDetail(detail)) return;
    if (lastFetchRef.current === resolvedDetailPath) return;

    let active = true;
    lastFetchRef.current = resolvedDetailPath;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/stream?action=detail&detailPath=${encodeURIComponent(resolvedDetailPath)}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        const candidate = data?.data || data?.items?.[0] || null;
        if (active && isValidDetail(candidate)) {
          setDetail(candidate);
          setError(null);
        } else if (active) {
          setError("Detail tidak ditemukan.");
        }
      } catch {
        if (active) {
          setError("Gagal memuat detail.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchDetail();
    return () => {
      active = false;
    };
  }, [resolvedDetailPath, detail]);

  useEffect(() => {
    if (initialRecommendations.length > 0) {
      setRecommendations(initialRecommendations);
    }
  }, [initialRecommendations]);

  useEffect(() => {
    if (!detail) return;
    if (detail.seasons && detail.seasons.length > 0) {
      setActiveSeason(detail.seasons[0].season);
    }
  }, [detail]);

  const seriesId = detail?.id || detail?.detailPath || resolvedDetailPath || "series";
  const isSeries = Boolean(detail?.seasons?.length || detail?.episodes?.length);
  const defaultMovieUrl = detail?.playerUrl || detail?.iframe || null;

  const getEpisodeCount = (key: string) => {
    try {
      const raw = localStorage.getItem(key);
      const current = Number(raw ?? "0");
      return Number.isFinite(current) ? current : 0;
    } catch {
      return 0;
    }
  };

  const setEpisodeCount = (key: string, value: number) => {
    try {
      localStorage.setItem(key, String(value));
    } catch {
      // ignore
    }
  };

  const shouldTriggerPopunder = (contentType: "movie" | "series", seriesKey?: string | null) => {
    if (contentType === "movie") return true;
    if (!seriesKey) return true;
    const key = `shopee_episode_count_${seriesKey}`;
    const next = getEpisodeCount(key) + 1;
    setEpisodeCount(key, next);
    return next % 3 === 1;
  };

  const attemptPlay = (
    url: string | null,
    contentType: "movie" | "series",
    seriesKey?: string | null,
    source: "user" | "autoplay" = "user"
  ) => {
    if (!url) return;
    if (source === "autoplay") {
      setCurrentVideoUrl(url);
      return;
    }

    const shouldPopunder = shouldTriggerPopunder(contentType, seriesKey);
    if (shouldPopunder) {
      triggerPopunder();
    }

    setCurrentVideoUrl(url);
  };

  const handleMoviePlay = () => {
    attemptPlay(defaultMovieUrl, "movie", null, "user");
  };

  const handleEpisodePlay = (url: string) => {
    if (!url) return;
    attemptPlay(url, "series", seriesId, "user");
  };

  const firstEpisodeUrl = (() => {
    if (detail?.seasons && detail.seasons.length > 0) {
      const seasonData =
        detail.seasons.find((s: any) => s.season === activeSeason) || detail.seasons[0];
      return seasonData?.episodes?.[0]?.playerUrl || null;
    }
    if (detail?.episodes?.length) {
      return detail.episodes[0]?.playerUrl || null;
    }
    return null;
  })();

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!detail)
    return (
      <div className="container" style={{ paddingTop: "20px" }}>
        <p>{error ?? "Detail tidak ditemukan."}</p>
        <button className="btn btn-primary" type="button" onClick={() => window.location.reload()}>
          Muat Ulang
        </button>
      </div>
    );

  return (
    <div className="container detailContainer" style={{ marginTop: "20px" }}>
      {(currentVideoUrl || defaultMovieUrl || isSeries) && (
        <div className="watch-container">
          <div className="video-section">
            {currentVideoUrl ? (
              <VideoPlayer key={currentVideoUrl} url={currentVideoUrl} />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "360px",
                  background: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                }}
              >
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    if (isSeries && firstEpisodeUrl) {
                      handleEpisodePlay(firstEpisodeUrl);
                    } else {
                      handleMoviePlay();
                    }
                  }}
                >
                  Play
                </button>
              </div>
            )}
            <AdSlot slot="BELOW_PLAYER_NATIVE" className="ad-below-player" />
          </div>

          {(detail.seasons && detail.seasons.length > 0) || (detail.episodes && detail.episodes.length > 0) ? (
            <div className="episode-sidebar">
              <div className="episode-header">
                <h2 className="sectionTitle" style={{ marginBottom: 0, fontSize: "1.2rem" }}>
                  Episodes
                </h2>
                {detail.seasons && detail.seasons.length > 1 && (
                  <div className="seasonSelector">
                    <select
                      value={activeSeason}
                      onChange={(e) => setActiveSeason(Number(e.target.value))}
                      style={{
                        padding: "5px",
                        borderRadius: "4px",
                        backgroundColor: "#333",
                        color: "white",
                        border: "1px solid #555",
                      }}
                    >
                      {detail.seasons.map((s: any) => (
                        <option key={s.season} value={s.season}>
                          S{s.season}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="episodeList sidebar-list">
                {(() => {
                  let episodesToRender: any[] = [];
                  if (detail.seasons && detail.seasons.length > 0) {
                    const seasonData =
                      detail.seasons.find((s: any) => s.season === activeSeason) || detail.seasons[0];
                    episodesToRender = seasonData ? seasonData.episodes : [];
                  } else if (detail.episodes) {
                    episodesToRender = detail.episodes;
                  }

                  const splitIndex = 6;
                  const shouldInsertAd = episodesToRender.length > splitIndex;
                  const firstBlock = episodesToRender.slice(0, splitIndex);
                  const restBlock = episodesToRender.slice(splitIndex);

                  return (
                    <>
                      {firstBlock.map((ep: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handleEpisodePlay(ep.playerUrl)}
                          className={`episodeBtn sidebar-btn ${currentVideoUrl === ep.playerUrl ? "active" : ""}`}
                        >
                          <span className="ep-num">{idx + 1}</span>
                          <span className="ep-title">{ep.title || `Episode ${ep.episode || idx + 1}`}</span>
                        </button>
                      ))}
                      {shouldInsertAd && (
                        <AdSlot slot="INFEED_BANNER" className="ad-infeed ad-episode" />
                      )}
                      {restBlock.map((ep: any, idx: number) => (
                        <button
                          key={idx + splitIndex}
                          onClick={() => handleEpisodePlay(ep.playerUrl)}
                          className={`episodeBtn sidebar-btn ${currentVideoUrl === ep.playerUrl ? "active" : ""}`}
                        >
                          <span className="ep-num">{idx + splitIndex + 1}</span>
                          <span className="ep-title">{ep.title || `Episode ${ep.episode || idx + splitIndex + 1}`}</span>
                        </button>
                      ))}
                    </>
                  );
                })()}
              </div>

            </div>
          ) : null}
        </div>
      )}

      <div className="detailHeader">
        <Image
          src={detail.poster || detail.posterUrl || "/placeholder-poster.svg"}
          alt={detail.title || "Poster"}
          className="detailPoster"
          width={500}
          height={750}
          sizes="(max-width: 768px) 60vw, 250px"
          priority
        />
        <div className="detailInfo">
          <h1 className="detailTitle">{detail.title}</h1>
          <div className="detailMeta">
            <span className="detailRating">
              <Star size={20} fill="#fbbf24" stroke="none" />
              {detail.rating}
            </span>
            <span>
              <Calendar size={18} style={{ marginRight: "5px", verticalAlign: "text-bottom" }} />
              {detail.year}
            </span>
            <span>
              <Film size={18} style={{ marginRight: "5px", verticalAlign: "text-bottom" }} />
              {detail.type}
            </span>
            {detail.genre && <span className="detailGenre">{detail.genre}</span>}
          </div>
          <p className="detailDesc">{detail.description || detail.plot || "No description available."}</p>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="recommendationsSection">
          <h2 className="sectionTitle">Rekomendasi</h2>
          <div className="recommendationsGrid">
            {recommendations.map((item, idx) => (
              <MovieCard key={idx} movie={item} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default DetailClient;
