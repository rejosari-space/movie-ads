"use client";

import { useEffect, useState } from "react";
import { clearAdblockCache, detectAdblock } from "@/lib/adblock/detect";

type Status = "idle" | "checking" | "detected" | "clean";

const AdblockTestPage = () => {
  const [status, setStatus] = useState<Status>("idle");

  const runCheck = async () => {
    setStatus("checking");
    clearAdblockCache();
    const detected = await detectAdblock();
    setStatus(detected ? "detected" : "clean");
  };

  useEffect(() => {
    runCheck();
  }, []);

  const statusLabel = (() => {
    switch (status) {
      case "checking":
        return "Checking...";
      case "detected":
        return "Adblock detected";
      case "clean":
        return "No adblock detected";
      default:
        return "Idle";
    }
  })();

  return (
    <div className="container" style={{ padding: "30px 0 60px" }}>
      <h1 style={{ marginBottom: "10px" }}>Adblock Test</h1>
      <p style={{ color: "var(--text-secondary)" }}>Status: {statusLabel}</p>
      <button className="btn btn-primary" type="button" onClick={runCheck}>
        Re-run detection
      </button>
    </div>
  );
};

export default AdblockTestPage;
