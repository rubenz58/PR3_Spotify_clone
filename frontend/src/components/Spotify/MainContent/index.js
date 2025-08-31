import { useNavigate, Navigate } from 'react-router-dom';

import useStore from '../../../stores/useStore';
import { LoadingSpinner } from '../../Utils/Utils';
import { MainContentSkeleton } from '../../Utils/MainContentSkeleton';
import { SongList } from '../SongList';
import './MainContent.css';

export function MainContent() {

  console.log("MainContent");

  const navigate = useNavigate();

  const { user, authLoading } = useStore();

  if (authLoading) return <MainContentSkeleton />;
  if (!user) return <Navigate to="/login" replace/>;

  const handleLikedSongsClick = () => {
    if (!user) return; // Prevent action if not logged in
    console.log('Opening liked songs');
    navigate('/liked-songs');
  };

  const handleRecentlyPlayedClick = () => {
    if (!user) return; // Prevent action if not logged in
    console.log('Opening recently played');
    navigate('/recently-played');
  };

  return (
    <div className="main-content">
      {/* Page Header */}
      <div className="content-header">
        <h1 className="content-title">Good evening</h1>
        <p className="content-subtitle">Your music library</p>
      </div>

      {/* Main Content Area */}
      <div className="content-body">
        {/* Quick Access Cards - Recently Played */}
        <section className="quick-access-section">
          <div className="quick-access-grid">
            <div className="quick-card">
              <div className="quick-card-image">🔥</div>
              <span className="quick-card-title">Discover Weekly</span>
            </div>
            <div className="quick-card">
              <div className="quick-card-image">🌅</div>
              <span className="quick-card-title">Daily Mix 1</span>
            </div>
            <div className="quick-card"
              onClick={handleLikedSongsClick}>
              <div className="quick-card-image">💚</div>
              <span className="quick-card-title">Liked Songs</span>
            </div>
            <div className="quick-card"
              onClick={handleRecentlyPlayedClick}>
              <div className="quick-card-image">🎵</div>
              <span className="quick-card-title">Recently Played</span>
            </div>
          </div>
        </section>

        {/* Song List Section */}
        <section className="songs-section">
          <div className="section-header">
            <h2 className="section-title">All Songs</h2>
            <button className="view-all-btn">Show all</button>
          </div>
          {/* <SongList /> */}
        </section>

        {/* Placeholder for other sections */}
        <section className="placeholder-section">
          <div className="section-header">
            <h2 className="section-title">Made for You</h2>
            <button className="view-all-btn">Show all</button>
          </div>
          <div className="placeholder-content">
            <p>More content sections will go here...</p>
            <ul>
              <li>Search Results</li>
              <li>Playlist Views</li>
              <li>Artist Pages</li>
              <li>Album Views</li>
              <li>Recommendations</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}