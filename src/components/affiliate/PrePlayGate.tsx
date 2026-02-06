"use client";

type PrePlayGateProps = {
  open: boolean;
  onSkip: () => void;
  onAffiliateClick: () => void;
};

const PrePlayGate = ({ open, onSkip, onAffiliateClick }: PrePlayGateProps) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Affiliate link"
    >
      <div
        style={{
          background: "var(--surface-color)",
          borderRadius: "8px",
          padding: "20px",
          width: "100%",
          maxWidth: "360px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          Affiliate link
        </div>
        <div style={{ marginTop: "16px", display: "grid", gap: "10px" }}>
          <button className="btn btn-primary" type="button" onClick={onSkip}>
            Play
          </button>
          <button
            className="btn"
            type="button"
            onClick={onAffiliateClick}
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "white" }}
          >
            Open
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrePlayGate;
