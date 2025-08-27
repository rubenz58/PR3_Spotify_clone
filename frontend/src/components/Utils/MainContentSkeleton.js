// components/Utils/MainContentSkeleton.js
import './MainContentSkeleton.css';

export function MainContentSkeleton() {
  return (
    <div className="main-content-skeleton">
      {/* Page Header Skeleton */}
      <div className="skeleton-header">
        <div className="skeleton-title shimmer"></div>
        <div className="skeleton-subtitle shimmer"></div>
      </div>

      {/* Quick Access Cards Skeleton */}
      <div className="skeleton-quick-access">
        <div className="skeleton-quick-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-quick-card">
              <div className="skeleton-card-image shimmer"></div>
              <div className="skeleton-card-title shimmer"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Songs Section Skeleton */}
      <div className="skeleton-songs-section">
        <div className="skeleton-section-header">
          <div className="skeleton-section-title shimmer"></div>
          <div className="skeleton-view-all-btn shimmer"></div>
        </div>
        
        {/* Song rows skeleton */}
        <div className="skeleton-song-list">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="skeleton-song-row">
              <div className="skeleton-song-number shimmer"></div>
              <div className="skeleton-song-image shimmer"></div>
              <div className="skeleton-song-info">
                <div className="skeleton-song-title shimmer"></div>
                <div className="skeleton-song-artist shimmer"></div>
              </div>
              <div className="skeleton-song-duration shimmer"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Placeholder Section Skeleton */}
      <div className="skeleton-placeholder-section">
        <div className="skeleton-section-header">
          <div className="skeleton-section-title shimmer"></div>
          <div className="skeleton-view-all-btn shimmer"></div>
        </div>
        <div className="skeleton-placeholder-content">
          <div className="skeleton-text-line shimmer"></div>
          <div className="skeleton-text-line shimmer"></div>
          <div className="skeleton-text-line shimmer"></div>
        </div>
      </div>
    </div>
  );
}