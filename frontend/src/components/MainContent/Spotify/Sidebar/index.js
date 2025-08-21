// components/Sidebar/Sidebar.js
import { useState, useEffect } from 'react';
import useStore from '../../../../stores/useStore';
import './Sidebar.css';

export function Sidebar() {
  const { user, playlists, fetchPlaylists } = useStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    if (user) {
      // fetchPlaylists();
    }
  }, [user]);

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      // TODO: Implement createPlaylist in useStore
      console.log('Creating playlist:', newPlaylistName);
      setNewPlaylistName('');
      setShowCreateForm(false);
    }
  };

  const handlePlaylistClick = (playlist) => {
    // TODO: Navigate to playlist view
    console.log('Opening playlist:', playlist.name);
  };

  return (
    <div className="sidebar">
      {/* Library Header */}
      <div className="library-header">
        <div className="library-title">
          <span className="library-icon">📚</span>
          Your Library
        </div>
        <button 
          className="create-playlist-btn"
          onClick={() => setShowCreateForm(true)}
          title="Create Playlist"
        >
          ➕
        </button>
      </div>

      {/* Quick Access Items */}
      <div className="quick-access">
        <div className="quick-item liked-songs">
          <div className="quick-item-icon liked-icon">💚</div>
          <span className="quick-item-text">Liked Songs</span>
        </div>
      </div>

      {/* Create Playlist Form */}
      {showCreateForm && (
        <div className="create-form">
          <form onSubmit={handleCreatePlaylist}>
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="playlist-name-input"
              autoFocus
            />
            <div className="form-buttons">
              <button type="submit" className="save-btn">Save</button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewPlaylistName('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Playlists List */}
      <div className="playlists-section">
        <div className="playlists-list">
          {playlists && playlists.length > 0 ? (
            playlists.map(playlist => (
              <div 
                key={playlist.id} 
                className="playlist-item"
                onClick={() => handlePlaylistClick(playlist)}
              >
                <div className="playlist-icon">🎵</div>
                <div className="playlist-info">
                  <div className="playlist-name">{playlist.name}</div>
                  <div className="playlist-details">
                    Playlist • {playlist.song_count || 0} songs
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No playlists yet</p>
              <p className="empty-subtitle">Create your first playlist!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recently Played Section */}
      <div className="recently-played">
        <h3 className="section-title">Recently Played</h3>
        <div className="recent-item">
          <div className="recent-icon">🎵</div>
          <div className="recent-info">
            <div className="recent-name">Today's Hits</div>
            <div className="recent-type">Playlist</div>
          </div>
        </div>
      </div>
    </div>
  );
}