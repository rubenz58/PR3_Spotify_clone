import { useState } from 'react';
import useStore from "../../../stores/useStore";
import { AddToPlaylistDropdown } from './AddToPlaylistDropdown';
import './Song.css';

export function Song({ song, showRemoveButton = false, onRemove }) {
  
  // Playlist or Album or whoever renders the Songs
  // knows the context in which they are getting displayed
  // Sets the Context with showRemoveButton.
  // CONTEXT DEPENDENCE VS. CONTEXT INDEPENDENCE (eg. liked songs)

  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay,
    likedSongs,
    removeLikedSong,
    addLikedSong,
    queueSongs,
    addToQueue,
    removeFromQueue,
  } = useStore();

  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);

  const isLiked = likedSongs?.some(likedSong => likedSong.id === song.id);
  const isInQueue = queueSongs?.some(queueSong => queueSong.id === song.id);

  const handleQueueClick = async (e) => {
    e.stopPropagation();
    if (isInQueue) {
      await removeFromQueue(song.id);
    } else {
      await addToQueue(song.id);
    }
  };


  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (isLiked) {
      await removeLikedSong(song.id);
    } else {
      await addLikedSong(song.id);
    }
  };

  const handlePlayClick = () => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    setShowPlaylistDropdown(!showPlaylistDropdown);
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(song);
    }
  };

  const isCurrentSong = currentSong?.id === song.id;

  return (
    <div className="song-row">
      <button className="song-play-button" onClick={handlePlayClick}>
        {isCurrentSong && isPlaying ? '⏸️' : '▶️'}
      </button>

      <div className="song-info">
        <div className="song-title">{song.title}</div>
        <div className="song-artist">{song.artist}</div>
      </div>
      
      <div className="song-duration">
        {song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : '--:--'}
      </div>

      <div className="song-actions">
        {showRemoveButton && (
          <button 
            className="action-button remove-button" 
            onClick={handleRemoveClick}
            title="Remove from playlist"
          >
            −
          </button>
        )}
        
        <div className="add-button-container">
          <button 
            className="action-button add-button" 
            onClick={handleAddClick}
            title="Add to playlist"
          >
            +
          </button>
          {showPlaylistDropdown && (
            <AddToPlaylistDropdown 
              song={song} 
              onClose={() => setShowPlaylistDropdown(false)}
            />
          )}
        </div>

        <button
          className={`action-button queue-button ${isInQueue ? 'in-queue' : ''}`}
          onClick={handleQueueClick}
          title={isInQueue ? "Remove from queue" : "Add to queue"}
        >
          +Q
        </button>

        <button
          className="action-button like-button"
          onClick={handleLikeClick}
          title={isLiked ? "Remove from liked songs" : "Add to liked songs"}
        >
          {isLiked ? '💚' : '♡'}
        </button>
      </div>
    </div>
  );
}