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
    playlists,
    specialPlaylists,
    fetchPlaylists,
    createNewPlaylist,
    deletePlaylist,
    renamePlaylist,
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
      fetchPlaylists();
    }
  }, [user]);

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!user) return;
    if (newPlaylistName.trim()) {
      console.log('Creating playlist:', newPlaylistName);
      createNewPlaylist(newPlaylistName);
      setNewPlaylistName('');
      setShowCreateForm(false);
    }
  };

  const handlePlaylistClick = (playlist) => {
    if (!user) return;
    console.log('Opening playlist:', playlist.name);
    navigate(`/playlist/${playlist.id}`);
  };

  // Helper function to get the appropriate icon for special playlists
  const getSpecialPlaylistIcon = (playlistType) => {
    switch (playlistType) {
      case 'liked_songs':
        return '💚';
      case 'queue':
        return '📋';
      case 'recently_played':
        return '🕒';
      default:
        return '🎵';
    }
  };

  // Sort special playlists in the desired order
  const getSortedSpecialPlaylists = () => {
    if (!specialPlaylists) return [];
    
    const order = ['liked_songs', 'queue', 'recently_played'];
    return specialPlaylists.sort((a, b) => {
      const aIndex = order.indexOf(a.playlist_type);
      const bIndex = order.indexOf(b.playlist_type);
      return aIndex - bIndex;
    });
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
          {/* Special Playlists First */}
          {getSortedSpecialPlaylists().map(playlist => (
            <div
              key={`special-${playlist.id}`}
              className="playlist-item special-playlist"
              onClick={() => handlePlaylistClick(playlist)}
              style={{ cursor: !user ? 'not-allowed' : 'pointer' }}
            >
              <div className="playlist-icon">
                {getSpecialPlaylistIcon(playlist.playlist_type)}
              </div>
              <div className="playlist-info">
                <div className="playlist-name">{playlist.name}</div>
                <div className="playlist-details">
                  {playlist.playlist_type === 'liked_songs' ? 'Liked Songs' : 'Playlist'} • {playlist.song_count || 0} songs
                </div>
              </div>
              {/* No dropdown for special playlists since they're not editable */}
            </div>
          ))}

          {/* User Created Playlists */}
          {playlists && playlists.length > 0 ? (
            playlists.map(playlist => (
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
                  className="playlist-item user-playlist"
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
            // Only show empty state if no special playlists and no user playlists
            (!specialPlaylists || specialPlaylists.length === 0) && (
              <div className="empty-state">
                <p>No playlists yet</p>
                <p className="empty-subtitle">Create your first playlist!</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Recently Played Section - Remove this since it's now in the main list */}
      {/* You can keep this section for other recent items if needed */}
    </div>
  );
}