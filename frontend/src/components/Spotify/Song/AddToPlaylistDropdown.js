// components/Song/AddToPlaylistDropdown.js
import { useState, useRef, useEffect } from 'react';
import useStore from '../../../stores/useStore';
import './AddToPlaylistDropdown.css';

export function AddToPlaylistDropdown({ song, onClose }) {
  const { playlists, addSongToPlaylist } = useStore();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handlePlaylistClick = async (playlist) => {
    const result = await addSongToPlaylist(playlist.id, song.id);
    if (result.success) {
      console.log(`Added "${song.title}" to "${playlist.name}"`);
    }
    onClose();
  };

  return (
    <div className="add-to-playlist-dropdown" ref={dropdownRef}>
      <div className="dropdown-header">Add to playlist</div>
      <div className="playlist-options">
        {playlists && playlists.length > 0 ? (
          playlists.map(playlist => (
            <button
              key={playlist.id}
              className="playlist-option"
              onClick={() => handlePlaylistClick(playlist)}
            >
              <div className="playlist-option-icon">🎵</div>
              <div className="playlist-option-info">
                <div className="playlist-option-name">{playlist.name}</div>
                <div className="playlist-option-count">{playlist.song_count} songs</div>
              </div>
            </button>
          ))
        ) : (
          <div className="no-playlists">
            <p>No playlists available</p>
          </div>
        )}
      </div>
    </div>
  );
}