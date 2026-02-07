"use client";

let lastTrigger = 0;
const MIN_INTERVAL_MS = 2000;

const POPUNDER_SRC = process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_SRC;

export const triggerPopunder = () => {
  if (!POPUNDER_SRC) return;
  if (typeof document === "undefined") return;
  const now = Date.now();
  if (now - lastTrigger < MIN_INTERVAL_MS) return;
  lastTrigger = now;

  const script = document.createElement("script");
  script.src = POPUNDER_SRC;
  script.async = true;
  script.setAttribute("data-popunder", "true");
  script.onload = () => {
    script.remove();
  };
  document.body.appendChild(script);
};
