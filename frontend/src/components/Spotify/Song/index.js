import { useState } from 'react';
import useStore from "../../../stores/useStore";
import { AddToPlaylistDropdown } from './AddToPlaylistDropdown';
import './Song.css';

export function Song({
  song,
  showRemoveButton = false,
  onRemove,
  context = null
}) {
  
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
    setCurrentPlaylistId,
    setCurrentContext,
    setPlaybackContext,
    currentContextSong,
    currentContext,
  } = useStore();

  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const isLiked = likedSongs?.some(likedSong => likedSong.id === song.id);
  const isCurrentSong = currentSong?.id === song.id;
  const isCurrentSongInContext = 
    currentContextSong?.id === song.id && currentContext === context?.type;

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
      return;
    }

    // Immediately play the clicked song
    playSong(song);

    if (context) {
      setCurrentPlaylistId(context.id);
      setCurrentContext(context.type);

      console.log("currentPlaylistId: ", context.id);
      console.log("currentContext: ", context.type);

      let songs = [];

      // Use already loaded songs instead of fetching
      switch (context.type) {
        case "playlist":
          songs = useStore.getState().currentPlaylistSongs;
          break;
        case "album":
          songs = useStore.getState().currentAlbumSongs;
          break;
        case "liked_songs":
          songs = useStore.getState().likedSongs;
          break;
        case "queue":
          songs = useStore.getState().queueSongs;
          break;
        case "recently_played":
          songs = useStore.getState().recentlyPlayedSongs;
          break;
        default:
          songs = [];
      }

      // Set playback context for player
      setPlaybackContext(songs, song);
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

  return (
    <div className={`song-row ${isCurrentSong ? 'current-song' : ''}`}>
      <button className="song-play-button" onClick={handlePlayClick}>
        { isCurrentSong && isPlaying ? '⏸️' : '▶️'}
      </button>

      <div className="song-info">
        <div className={`song-title ${isCurrentSongInContext ? 'playing' : ''}`}>
          {song.title}
        </div>
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
          className="action-button like-button"
          onClick={ handleLikeClick }
          title={ isLiked ? "Remove from liked songs" : "Add to liked songs"}
        >
          {isLiked ? '💚' : '♡'}
        </button>
      </div>
    </div>
  );
}