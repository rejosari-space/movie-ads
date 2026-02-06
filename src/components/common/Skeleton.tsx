export const SkeletonCard = () => (
  <div
    style={{
      aspectRatio: "2/3",
      backgroundColor: "var(--surface-color)",
      borderRadius: "var(--border-radius)",
      animation: "pulse 1.5s infinite",
    }}
  />
);

export const SectionSkeleton = () => (
  <div className="section container">
    <div
      style={{
        width: "200px",
        height: "30px",
        backgroundColor: "var(--surface-color)",
        marginBottom: "20px",
        borderRadius: "4px",
      }}
    />
    <div className="grid">
      {[...Array(5)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);
