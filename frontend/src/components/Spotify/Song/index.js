import { useState } from 'react';
import useStore from "../../../stores/useStore";
import { AddToPlaylistDropdown } from './AddToPlaylistDropdown';
import './Song.css';

export function Song({ song, showRemoveButton = false, onRemove }) {
  
  const {
    currentSong,
    isPlaying,
    playSong,
    togglePlay
  } = useStore();

  // console.log("Song component rendering:", song.title);
  // console.log("currentSong from store:", currentSong);
  // console.log("isPlaying from store:", isPlaying);

  // console.log("Rendering song:", song.title, "Current song ID:", currentSong?.id);
  
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);

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
  // console.log("Is current song?", isCurrentSong, "Button text should be:", isCurrentSong && isPlaying ? '⏸️' : '▶️');


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
      </div>
    </div>
  );
}