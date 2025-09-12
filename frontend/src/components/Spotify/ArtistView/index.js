import useStore from "../../../stores/useStore";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export function ArtistView({ artistId }) {
  console.log("ArtistView");
  
  const navigate = useNavigate();
  
  const {
    user,
    fetchArtistInfo,
    currentArtist,
    currentArtistAlbums,
    artistLoading
  } = useStore();

  useEffect(() => {
    if (artistId && user) {
      fetchArtistInfo(artistId);
    }
  }, [artistId, user]);

  const handleAlbumClick = (album) => {
    navigate(`/albums/${album.id}?autoplay=true`);
};

  if (artistLoading) return <div>Loading artist...</div>;
  if (!currentArtist) return <div>Artist not found</div>;

  return (
    <div className="main-content">
      {/* Artist Header */}
      <div className="content-header">
        <h1 className="content-title">{currentArtist.name}</h1>
        {currentArtist.bio && (
          <p className="content-subtitle">{currentArtist.bio}</p>
        )}
      </div>

      {/* Artist Albums */}
      <div className="content-body">
        <section className="featured-albums-section">
          <div className="section-header">
            <h2 className="section-title">Albums</h2>
          </div>
          <div className="albums-grid">
            {currentArtistAlbums && currentArtistAlbums.length > 0 ? (
              currentArtistAlbums.map(album => (
                <div 
                  key={album.id} 
                  className="album-card"
                  onClick={() => handleAlbumClick(album)}
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
                    <p className="album-artist">{currentArtist.name}</p>
                  </div>
                </div>
              ))
            ) : (
              <div>No albums found for this artist</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}