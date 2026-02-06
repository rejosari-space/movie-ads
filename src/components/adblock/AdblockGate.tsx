"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AD_CONFIG } from "@/lib/ads/config";
import { clearAdblockCache, detectAdblock } from "@/lib/adblock/detect";

const toBoolean = (value?: string) => value === "true";

const GATE_ENABLED = toBoolean(process.env.NEXT_PUBLIC_ADBLOCK_GATE);
const ADS_ENABLED = toBoolean(process.env.NEXT_PUBLIC_ADS_ENABLED);
const PROVIDER_ENABLED = toBoolean(process.env.NEXT_PUBLIC_ADSTERRA_ENABLED);

const DISMISS_SESSION_KEY = "adblock_gate_dismissed_session";
const SESSION_ID_KEY = "adblock_gate_session_id";

const getSessionId = () => {
  if (typeof window === "undefined") return "";
  try {
    const existing = sessionStorage.getItem(SESSION_ID_KEY);
    if (existing) return existing;
    const created = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_ID_KEY, created);
    return created;
  } catch {
    return "";
  }
};

const isDismissedForSession = () => {
  if (typeof window === "undefined") return false;
  try {
    const sessionId = getSessionId();
    const stored = localStorage.getItem(DISMISS_SESSION_KEY);
    return Boolean(sessionId && stored && stored === sessionId);
  } catch {
    return false;
  }
};

const setDismissedForSession = () => {
  if (typeof window === "undefined") return;
  try {
    const sessionId = getSessionId();
    if (sessionId) {
      localStorage.setItem(DISMISS_SESSION_KEY, sessionId);
    }
  } catch {
    // ignore
  }
};

const normalizePathname = (pathname: string, basePath: string) => {
  if (!pathname) return "/";
  const clean = pathname.split("?")[0].split("#")[0];
  if (basePath && clean.startsWith(basePath)) {
    const stripped = clean.slice(basePath.length);
    const normalized = stripped.length === 0 ? "/" : stripped;
    return normalized.length > 1 ? normalized.replace(/\/$/, "") : normalized;
  }
  return clean.length > 1 ? clean.replace(/\/$/, "") : clean;
};

const AdblockGate = () => {
  const pathname = usePathname() ?? "/";
  const normalizedPath = useMemo(
    () => normalizePathname(pathname, AD_CONFIG.basePath),
    [pathname]
  );

  const isMoviePage = useMemo(() => {
    if (normalizedPath.startsWith("/detail")) return true;
    return pathname.includes("/detail/");
  }, [normalizedPath, pathname]);

  const gateEnabled = GATE_ENABLED && ADS_ENABLED && PROVIDER_ENABLED;

  const [adblockDetected, setAdblockDetected] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const canDismiss = !isMoviePage;

  useEffect(() => {
    if (!gateEnabled) return;
    let active = true;
    setChecked(false);
    detectAdblock()
      .then((detected) => {
        if (active) setAdblockDetected(detected);
      })
      .finally(() => {
        if (active) setChecked(true);
      });
    return () => {
      active = false;
    };
  }, [gateEnabled, pathname]);

  useEffect(() => {
    if (!gateEnabled || !canDismiss) {
      setDismissed(false);
      return;
    }
    setDismissed(isDismissedForSession());
  }, [canDismiss, gateEnabled, pathname]);

  const shouldShow = gateEnabled && checked && adblockDetected && (!canDismiss || !dismissed);

  if (!shouldShow) return null;

  return (
    <div className={`adblock-gate ${isMoviePage ? "adblock-gate--hard" : ""}`} role="presentation">
      <div className="adblock-card" role="dialog" aria-modal="true" aria-label="Adblock Gate">
        <h2>Matikan AdBlock untuk melanjutkan</h2>
        <p>Iklan membantu biaya server. Silakan nonaktifkan AdBlock lalu refresh halaman.</p>

        <div className="adblock-actions">
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              clearAdblockCache();
              window.location.reload();
            }}
          >
            Saya sudah mematikan
          </button>
          <button
            className="btn adblock-secondary"
            type="button"
            onClick={() => setShowHelp((prev) => !prev)}
          >
            Cara mematikan AdBlock
          </button>
          {canDismiss && (
            <button
              className="btn adblock-tertiary"
              type="button"
              onClick={() => {
                setDismissedForSession();
                setDismissed(true);
              }}
            >
              Lanjutkan sementara
            </button>
          )}
        </div>

        {showHelp && (
          <div className="adblock-help">
            <strong>Panduan singkat:</strong>
            <ul>
              <li>uBlock Origin: klik ikon → toggle “off” untuk situs ini.</li>
              <li>AdBlock: klik ikon → “Don’t run on this site”.</li>
              <li>Brave: klik ikon shields → matikan “Shields” untuk situs ini.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdblockGate;
