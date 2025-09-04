import { useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import useStore from '../../../stores/useStore';
import { LoadingSpinner } from '../../Utils/Utils';
import { MainContentSkeleton } from '../../Utils/MainContentSkeleton';
import { SongList } from '../SongList';
import './MainContent.css';

export function MainContent() {
  // console.log("MainContent");

  const navigate = useNavigate();

  const {
    user,
    authLoading,
    fetchAllAlbums,
    all_albums,
  } = useStore();

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
            <div className="quick-card">
              <div className="quick-card-image">🔥</div>
              <span className="quick-card-title">Discover Weekly</span>
            </div>
            <div className="quick-card">
              <div className="quick-card-image">🌅</div>
              <span className="quick-card-title">Daily Mix 1</span>
            </div>
            <div className="quick-card">
              <div className="quick-card-image">🚗</div>
              <span className="quick-card-title">Spotify Driving</span>
            </div>
            <div className="quick-card">
              <div className="quick-card-image">☀️</div>
              <span className="quick-card-title">Spotify Summer Recs</span>
            </div>
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
                  onClick={() => navigate(`/albums/${album.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="album-cover">
                    {album.cover_image_url ? (
                      <img 
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