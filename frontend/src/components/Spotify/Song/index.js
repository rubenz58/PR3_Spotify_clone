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
    currentPlaylistId,
    setCurrentPlaylistId,
    setCurrentContext,
    fetchPlaylistSongs,
    fetchAlbumSongs,
    fetchLikedSongs,
    fetchQueueSongs,
    fetchRecentlyPlayedSongs,
    setPlaybackContext,
  } = useStore();

  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const isLiked = likedSongs?.some(likedSong => likedSong.id === song.id);
  const isCurrentSong = currentSong?.id === song.id;

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (isLiked) {
      await removeLikedSong(song.id);
    } else {
      await addLikedSong(song.id);
    }
  };

  const handlePlayClick = async () => {
    if (currentSong?.id === song.id) {
      togglePlay();
      return;
    }

    // Always play the clicked song
    playSong(song);

    if (context) {
      setCurrentPlaylistId(context.id);
      setCurrentContext(context.type);

      console.log("currentPlaylistId: ", context.id);
      console.log("currentContext: ", context.type);

      let songs = [];

      // Only fetch if switching context
      if (currentPlaylistId !== context.id) {
        if (context.type === "playlist") {
          songs = await fetchPlaylistSongs(context.id);
        } else if (context.type === "album") {
          songs = await fetchAlbumSongs(context.id);
        } else if (context.type === "liked_songs") {
          songs = await fetchLikedSongs();
        } else if (context.type === "queue") {
          songs = await fetchQueueSongs();
        } else if (context.type === "recently_played") {
          songs = await fetchRecentlyPlayedSongs();
        }
      } else {
        // Already in this context → grab current state
        songs = useStore.getState().currentPlaylistSongs;
      }

      // ✅ Now always set the explicit playback context
      setPlaybackContext(songs, song);
    }
  };

  // const handlePlayClick = () => {
  //   if (currentSong?.id === song.id) {
  //     togglePlay();
  //   } else {
  //     playSong(song);
      
  //     // Set context if provided
  //     if (context) {
  //       setCurrentPlaylistId(context.id);
  //       setCurrentContext(context.type);

  //       console.log("currentPlaylistId: ", context.id);
  //       console.log("currentContext: ", context.type);
        
  //       // Only fetch songs if we're switching to a different context
  //       if (currentPlaylistId !== context.id) {
  //         if (context.type === "playlist") {
  //           fetchPlaylistSongs(context.id);
  //         } else if (context.type === "album") {
  //           fetchAlbumSongs(context.id);
  //         } else if (context.type === "liked_songs") {
  //           fetchLikedSongs();
  //         } else if (context.type === "queue") {
  //           fetchQueueSongs();
  //         } else if (context.type === "recently_played") {
  //           fetchRecentlyPlayedSongs();
  //         }
  //       }
  //     }
  //   }
  // };

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
        {isCurrentSong && isPlaying ? '⏸️' : '▶️'}
      </button>

      <div className="song-info">
        <div className={`song-title ${isCurrentSong ? 'playing' : ''}`}>
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