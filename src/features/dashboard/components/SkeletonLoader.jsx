/**
 * Skeleton loader components for the dashboard.
 */

export function SkeletonCard({ height = '120px', count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="dash-skeleton-card" style={{ height }}>
          <div className="dash-skeleton-shimmer" />
        </div>
      ))}
    </>
  );
}

export function SkeletonText({ lines = 3, width }) {
  return (
    <div className="dash-skeleton-text">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="dash-skeleton-line"
          style={{ width: width || (i === lines - 1 ? '60%' : '100%') }}
        >
          <div className="dash-skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart({ height = '200px' }) {
  return (
    <div className="dash-skeleton-chart" style={{ height }}>
      <div className="dash-skeleton-shimmer" />
      <div className="dash-skeleton-bars">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="dash-skeleton-bar"
            style={{ height: `${30 + Math.random() * 60}%` }}
          >
            <div className="dash-skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonGrid({ cols = 4, rows = 1, cardHeight = '120px' }) {
  return (
    <div className="dash-skeleton-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      <SkeletonCard height={cardHeight} count={cols * rows} />
    </div>
  );
}

export function SkeletonHeatmap() {
  return (
    <div className="dash-skeleton-heatmap">
      <div className="dash-skeleton-shimmer" />
    </div>
  );
}
