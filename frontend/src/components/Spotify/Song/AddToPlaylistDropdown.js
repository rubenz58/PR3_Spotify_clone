// components/Song/AddToPlaylistDropdown.js
import { useState, useRef, useEffect } from 'react';
import useStore from '../../../stores/useStore';
import './AddToPlaylistDropdown.css';

/// TO ADD ///
/// Dropdown should show the user playlists, but not
/// the current playlist if the song is already in it.
/// Or it can, and you're just allowing duplicates.
/// To fix later.

export function AddToPlaylistDropdown({ song, onClose, showQueue=true }) {

  const {
    userPlaylists,
    addSongToPlaylist,
    queueSongs,
    addToQueue,
    removeFromQueue
  } = useStore();
  
  const dropdownRef = useRef(null);
  
  // Check if song is in queue
  const isInQueue = queueSongs?.some(queueSong => queueSong.id === song.id);

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

  const handleQueueClick = async () => {
    if (isInQueue) {
      const result = await removeFromQueue(song.id);
      if (result.success) {
        console.log(`Removed "${song.title}" from queue`);
      }
    } else {
      const result = await addToQueue(song.id);
      if (result.success) {
        console.log(`Added "${song.title}" to queue`);
      }
    }
    onClose();
  };

  return (
    <div className="add-to-playlist-dropdown" ref={dropdownRef}>
      <div className="dropdown-header">Add to playlist</div>
      <div className="playlist-options">
        {/* Queue option as first item */}
        {/* {showQueue && (
          <button
            className="playlist-option queue-option"
            onClick={handleQueueClick}
          >
            <div className="playlist-option-icon">📋</div>
            <div className="playlist-option-info">
              <div className="playlist-option-name">Queue Option Text</div>
              <div className="playlist-option-count">Additional Info</div>
            </div>
          </button>
        )} */}
        {showQueue && (<button
          className="playlist-option queue-option"
          onClick={ handleQueueClick }
        >
          <div className="playlist-option-icon">📋</div>
          <div className="playlist-option-info">
            <div className="playlist-option-name">
              {isInQueue ? 'Remove from Queue' : 'Add to Queue'}
            </div>
            <div className="playlist-option-count">Queue</div>
          </div>
        </button>)}

        {/* Separator line */}
        <div className="dropdown-separator"></div>

        {/* Regular playlists */}
        {userPlaylists && userPlaylists.length > 0 ? (
          userPlaylists.map(playlist => (
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