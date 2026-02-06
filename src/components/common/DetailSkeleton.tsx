"use client";

const DetailSkeleton = () => {
  return (
    <div className="container detailContainer" style={{ marginTop: "20px" }}>
      <div className="watch-container">
        <div className="video-section">
          <div className="skeleton-block skeleton-video" />
          <div className="skeleton-block skeleton-ad" />
        </div>
        <div className="episode-sidebar">
          <div className="skeleton-line" style={{ width: "60%" }} />
          <div className="skeleton-list">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="skeleton-line" />
            ))}
          </div>
        </div>
      </div>

      <div className="detailHeader">
        <div className="skeleton-block skeleton-poster" />
        <div className="detailInfo">
          <div className="skeleton-line" style={{ width: "70%" }} />
          <div className="skeleton-line" style={{ width: "50%" }} />
          <div className="skeleton-line" style={{ width: "90%" }} />
          <div className="skeleton-line" style={{ width: "85%" }} />
        </div>
      </div>
    </div>
  );
};

export default DetailSkeleton;
