// components/Header/SearchResults.js
import { useNavigate } from 'react-router-dom';
import './SearchResults.css';

export function SearchResults({ searchResults, searchLoading, onResultClick }) {
  const navigate = useNavigate();

  const handleSongClick = (song) => {
    navigate(`/albums/${song.album_id}?play_song=${song.id}`);
    onResultClick(); // Close dropdown
  };

  const handleAlbumClick = (album) => {
    navigate(`/albums/${album.id}`);
    onResultClick(); // Close dropdown
  };

  const handleArtistClick = (artist) => {
    navigate(`/artist/${artist.id}`);
    onResultClick(); // Close dropdown
  };

  if (searchLoading) {
    return (
      <div className="search-results-dropdown">
        <div className="search-loading">Searching...</div>
      </div>
    );
  }

  const hasResults = searchResults.songs.length > 0 || 
                    searchResults.albums.length > 0 || 
                    searchResults.artists.length > 0;

  if (!hasResults) {
    return (
      <div className="search-results-dropdown">
        <div className="search-no-results">No results found</div>
      </div>
    );
  }

  return (
    <div className="search-results-dropdown">
      {/* Artists */}
      {searchResults.artists.length > 0 && (
        <div className="search-section">
          <div className="search-section-title">Artists</div>
          {searchResults.artists.slice(0, 3).map(artist => (
            <div
              key={`artist-${artist.id}`}
              className="search-result-item"
              onClick={() => handleArtistClick(artist)}
            >
              <div className="search-result-icon">🎤</div>
              <div className="search-result-info">
                <div className="search-result-title">{artist.name}</div>
                <div className="search-result-subtitle">Artist</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Albums */}
      {searchResults.albums.length > 0 && (
        <div className="search-section">
          <div className="search-section-title">Albums</div>
          {searchResults.albums.slice(0, 3).map(album => (
            <div
              key={`album-${album.id}`}
              className="search-result-item"
              onClick={() => handleAlbumClick(album)}
            >
              <div className="search-result-icon">💿</div>
              <div className="search-result-info">
                <div className="search-result-title">{album.title}</div>
                <div className="search-result-subtitle">{album.artist}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Songs */}
      {searchResults.songs.length > 0 && (
        <div className="search-section">
          <div className="search-section-title">Songs</div>
          {searchResults.songs.slice(0, 5).map(song => (
            <div
              key={`song-${song.id}`}
              className="search-result-item"
              onClick={() => handleSongClick(song)}
            >
              <div className="search-result-icon">🎵</div>
              <div className="search-result-info">
                <div className="search-result-title">{song.title}</div>
                <div className="search-result-subtitle">{song.artist}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}