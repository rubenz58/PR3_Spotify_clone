// components/Sidebar/Sidebar.js
import { useState, useEffect } from 'react';
import useStore from '../../../stores/useStore';
import { useNavigate } from 'react-router-dom';

import { PlaylistDropdown } from './PlaylistDropdown';
import { PlaylistRename } from './PlaylistRename';
import './Sidebar.css';

export function Sidebar() {
  const {
    user,
    userPlaylists, // Fixed: should be userPlaylists not playlists
    fetchUserPlaylists,
    createNewPlaylist,
    deletePlaylist,
    renamePlaylist,
    setMobileActiveTab,
  } = useStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [renamingPlaylistId, setRenamingPlaylistId] = useState(null);

  const navigate = useNavigate();

  const handleDeletePlaylist = async (playlist) => {
    console.log('Delete playlist:', playlist.id);
    const result = await deletePlaylist(playlist.id);
    if (!result.success) {
        console.error('Delete failed:', result.error);
    }
  };

  const handleRenamePlaylist = (playlist) => {
    console.log('Rename playlist:', playlist.name);
    setRenamingPlaylistId(playlist.id);
  };

  const handleSaveRename = (playlistId, newName) => {
    console.log('Save rename:', playlistId, newName);
    renamePlaylist(playlistId, newName);
    setRenamingPlaylistId(null);
  };

  const handleCancelRename = () => {
    setRenamingPlaylistId(null);
  };

  useEffect(() => {
    if (user) {
      fetchUserPlaylists();
    }
  }, [user]);

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!user) return; // Prevent action if not logged in
    if (newPlaylistName.trim()) {
      console.log('Creating playlist:', newPlaylistName);
      createNewPlaylist(newPlaylistName);
      setNewPlaylistName('');
      setShowCreateForm(false);
    }
  };

  const handlePlaylistClick = (playlist) => {
    if (!user) return; // Prevent action if not logged in
    // console.log('Opening playlist:', playlist.name);
    setMobileActiveTab('playlist');
    navigate(`/playlist/${playlist.id}`);
  };

  const handleLikedSongsClick = () => {
    if (!user) return; // Prevent action if not logged in
    console.log('Opening liked songs');
    setMobileActiveTab('playlist');
    navigate('/liked-songs');
  };

  const handleQueueClick = () => {
    if (!user) return; // Prevent action if not logged in
    console.log('Opening queue');
    navigate('/queue');
  };

  const handleRecentlyPlayedClick = () => {
    if (!user) return; // Prevent action if not logged in
    console.log('Opening recently played');
    setMobileActiveTab('playlist');
    navigate('/recently-played');
  };

  return (
    <div className={`sidebar ${!user ? 'sidebar-disabled' : ''}`}>
      {/* Library Header */}
      <div className="library-header">
        <div className="library-title">
          <span className="library-icon">📚</span>
          Your Library
        </div>
        <button
          className="create-playlist-btn"
          onClick={() => user && setShowCreateForm(true)}
          disabled={!user}
          title="Create Playlist"
        >
          ➕
        </button>
      </div>

      {/* Login required overlay */}
      {!user && (
        <div className="login-required-overlay">
          <div className="login-message">
            <h4>Login Required</h4>
            <p>Sign in to access your library and create playlists</p>
          </div>
        </div>
      )}

      {/* Quick Access Items */}
      <div className="quick-access">
        <div 
          className="quick-item liked-songs"
          style={{ cursor: !user ? 'not-allowed' : 'pointer' }}
          onClick={handleLikedSongsClick}
        >
          <div className="quick-item-icon liked-icon">💚</div>
          <span className="quick-item-text">Liked Songs</span>
        </div>
        
        {/* <div 
          className="quick-item queue"
          style={{ cursor: !user ? 'not-allowed' : 'pointer' }}
          onClick={ handleQueueClick }
        >
          <div className="quick-item-icon queue-icon">📋</div>
          <span className="quick-item-text">Queue</span>
        </div> */}
        
        <div 
          className="quick-item recently-played"
          style={{ cursor: !user ? 'not-allowed' : 'pointer' }}
          onClick={handleRecentlyPlayedClick}
        >
          <div className="quick-item-icon recently-played-icon">🕒</div>
          <span className="quick-item-text">Recently Played</span>
        </div>
      </div>

      {/* Create Playlist Form */}
      {showCreateForm && user && (
        <div className="create-form">
          <form onSubmit={handleCreatePlaylist}>
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="playlist-name-input"
              autoFocus
              disabled={!user}
            />
            <div className="form-buttons">
              <button type="submit" className="save-btn" disabled={!user}>Save</button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewPlaylistName('');
                }}
                disabled={!user}
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
          {userPlaylists && userPlaylists.length > 0 ? (
            userPlaylists.map(playlist => (
              renamingPlaylistId === playlist.id ? (
                <PlaylistRename
                  key={playlist.id}
                  playlist={playlist}
                  onSave={handleSaveRename}
                  onCancel={handleCancelRename}
                />
              ) : (
                <div
                  key={playlist.id}
                  className="playlist-item"
                  onClick={() => handlePlaylistClick(playlist)}
                  style={{ cursor: !user ? 'not-allowed' : 'pointer' }}
                >
                  <div className="playlist-icon">🎵</div>
                  <div className="playlist-info">
                    <div className="playlist-name">{playlist.name}</div>
                    <div className="playlist-details">
                      Playlist • {playlist.song_count || 0} songs
                    </div>
                  </div>
                  <PlaylistDropdown
                    playlist={playlist}
                    onDelete={handleDeletePlaylist}
                    onRename={handleRenamePlaylist}
                  />
                </div>
              )
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
        <div 
          className="recent-item"
          style={{ cursor: !user ? 'not-allowed' : 'pointer' }}
        >
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