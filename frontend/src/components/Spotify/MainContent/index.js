import { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import useStore from '../../../stores/useStore';
import { MainContentSkeleton } from '../../Utils/MainContentSkeleton';
import './MainContent.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';

export function MainContent() {
  // console.log("MainContent");

  const navigate = useNavigate();

  const {
    user,
    authLoading,
    fetchAllAlbums,
    all_albums,
  } = useStore();

  const quickAccessItems = [
    { title: 'Discover Weekly', emoji: '🔥', route: '/playlist/5' },
    { title: 'Daily Mix 1', emoji: '🌅', route: '/playlist/4' },
    { title: 'Spotify Driving', emoji: '🚗', route: '/playlist/6' },
    { title: 'Spotify Summer Recs', emoji: '☀️', route: '/playlist/7' }
  ];

  useEffect(() => {
    if (user) {
      fetchAllAlbums();
    }
  }, [user]); // Fixed: Use user as dependency instead of all_albums

  if (authLoading) return <MainContentSkeleton />;
  if (!user) return <Navigate to="/login" replace/>;

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
            {quickAccessItems.map((item, index) => (
              <div 
                key={index}
                className="quick-card"
                onClick={() => navigate(item.route)}
                style={{ cursor: 'pointer' }}
              >
                <div className="quick-card-image">{item.emoji}</div>
                <span className="quick-card-title">{item.title}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="featured-albums-section">
          <div className="section-header">
            <h2 className="section-title">Featured Albums</h2>
            <button className="view-all-btn">Show all</button>
          </div>
          <div className="albums-grid">
            {all_albums && all_albums.length > 0 ? (
              all_albums.map(album => (
                <div 
                  key={album.id} 
                  className="album-card"
                  onClick={() => navigate(`/albums/${album.id}?autoplay=true`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="album-cover">
                    {album.cover_image_url ? (
                      <img
                        // src={`${BACKEND_URL}/api/albums/images/${album.cover_image_url}`}
                        src={album.cover_image_url} 
                        alt={`${album.title} cover`}
                        className="album-image"
                      />
                    ) : (
                      <div className="album-placeholder">🎵</div>
                    )}
                    <div className="play-button">▶️</div>
                  </div>
                  <div className="album-info">
                    <h3 className="album-title">{album.title}</h3>
                    <p className="album-artist">{album.artist}</p>
                  </div>
                </div>
              ))
            ) : (
              // Fallback static albums if no data loaded yet
              <>
                <div className="album-card">
                  <div className="album-cover">
                    <div className="album-placeholder">🎵</div>
                    <div className="play-button">▶️</div>
                  </div>
                  <div className="album-info">
                    <h3 className="album-title">Midnights</h3>
                    <p className="album-artist">Taylor Swift</p>
                  </div>
                </div>
                
                <div className="album-card">
                  <div className="album-cover">
                    <div className="album-placeholder">🎶</div>
                    <div className="play-button">▶️</div>
                  </div>
                  <div className="album-info">
                    <h3 className="album-title">Harry's House</h3>
                    <p className="album-artist">Harry Styles</p>
                  </div>
                </div>
                
                <div className="album-card">
                  <div className="album-cover">
                    <div className="album-placeholder">🎤</div>
                    <div className="play-button">▶️</div>
                  </div>
                  <div className="album-info">
                    <h3 className="album-title">Un Verano Sin Ti</h3>
                    <p className="album-artist">Bad Bunny</p>
                  </div>
                </div>
                
                <div className="album-card">
                  <div className="album-cover">
                    <div className="album-placeholder">🎸</div>
                    <div className="play-button">▶️</div>
                  </div>
                  <div className="album-info">
                    <h3 className="album-title">30</h3>
                    <p className="album-artist">Adele</p>
                  </div>
                </div>
                
                <div className="album-card">
                  <div className="album-cover">
                    <div className="album-placeholder">🎹</div>
                    <div className="play-button">▶️</div>
                  </div>
                  <div className="album-info">
                    <h3 className="album-title">Planet Her</h3>
                    <p className="album-artist">Doja Cat</p>
                  </div>
                </div>
                
                <div className="album-card">
                  <div className="album-cover">
                    <div className="album-placeholder">🥁</div>
                    <div className="play-button">▶️</div>
                  </div>
                  <div className="album-info">
                    <h3 className="album-title">Sour</h3>
                    <p className="album-artist">Olivia Rodrigo</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}