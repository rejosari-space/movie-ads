"use client";

import { useEffect, useState } from "react";
import PrePlayGate from "@/components/affiliate/PrePlayGate";

const SERIES_ID = "series-demo";
const KEY = `shopee_episode_count_${SERIES_ID}`;

const AffiliateTestPage = () => {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  const loadCount = () => {
    try {
      const value = Number(localStorage.getItem(KEY) || "0");
      setCount(Number.isFinite(value) ? value : 0);
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    loadCount();
  }, []);

  const incrementSeries = () => {
    try {
      const current = Number(localStorage.getItem(KEY) || "0") || 0;
      const next = current + 1;
      localStorage.setItem(KEY, String(next));
      setCount(next);
      if (next % 3 === 1) {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  };

  const resetSeries = () => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
    setCount(0);
  };

  const handleMoviePlay = () => {
    setOpen(true);
  };

  const handleSkip = () => {
    setOpen(false);
  };

  const handleAffiliate = () => {
    window.open("/go/shopee?item=DEFAULT_HIGH_COMMISSION&slot=preplay-test", "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <div className="container" style={{ padding: "30px 0" }}>
      <h1>Affiliate Test</h1>

      <div style={{ marginTop: "20px", display: "grid", gap: "12px" }}>
        <button className="btn btn-primary" type="button" onClick={handleMoviePlay}>
          Simulate Movie Play
        </button>

        <button className="btn" type="button" onClick={incrementSeries}>
          Simulate Series Episode Play
        </button>

        <button className="btn" type="button" onClick={resetSeries}>
          Reset Series Counter
        </button>

        <div style={{ color: "var(--text-secondary)" }}>
          Current series count: {count}
        </div>
      </div>

      <PrePlayGate open={open} onSkip={handleSkip} onAffiliateClick={handleAffiliate} />
    </div>
  );
};

export default AffiliateTestPage;
