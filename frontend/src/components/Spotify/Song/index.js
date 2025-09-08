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
    setPlaybackContext,
    currentContextSong,
    currentContext,
    queuePlaying,
    setCurrentQueueSongId,
    setCurrentContextAndPlaylist,
  } = useStore();

  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const isLiked = likedSongs?.some(likedSong => likedSong.id === song.id);
  const isCurrentSong = currentSong?.id === song.id;

  // if (currentSong?.id === song.id && currentContext === "playlist") {
  //   console.log(`Song ${song.title} in playlist ${context?.id}:`);
  //   console.log("  currentPlaylistId:", currentPlaylistId, typeof currentPlaylistId);
  //   console.log("  context.id:", context?.id, typeof context?.id);
  //   console.log("  String comparison:", String(currentPlaylistId) === String(context?.id));
  // }
  
  const isCurrentSongInContext = 
    currentSong?.id === song.id && 
    currentContextSong?.id === song.id && 
    currentContext === context?.type && 
    !queuePlaying &&
    // For playlists, also check the specific playlist ID matches
    (currentContext === "playlist" 
      ? String(currentPlaylistId) === String(context?.id)
      : true); // For non-playlist contexts, don't do additional ID checking

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (isLiked) {
      await removeLikedSong(song.id);
    } else {
      await addLikedSong(song.id);
    }
  };

  const handlePlayClick = () => {
    // Toggle if same song is already playing
    if (currentSong?.id === song.id) {
        togglePlay();
        return;
    }

    // Set context BEFORE playing song to ensure state is updated
    if (context) {
        setCurrentContextAndPlaylist(context.type, context.id);
        
        // Get songs and set playback context IMMEDIATELY after setting context
        let songs = [];
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
            case "recently_played":
                songs = useStore.getState().recentlyPlayedSongs;
                break;
            default:
                songs = [];
        }
        
        // Set playback context for player
        setPlaybackContext(songs, song);
    }

    // Play song AFTER context is set
    playSong(song);

    // Reset queue state since we're playing from a different context
    setCurrentQueueSongId(null);
    useStore.setState({ queuePlaying: false });
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
      <button className="song-play-button" onClick={ handlePlayClick }>
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
            onClick={ handleRemoveClick }
            title="Remove from playlist"
          >
            −
          </button>
        )}
        
        <div className="add-button-container">
          <button 
            className="action-button add-button" 
            onClick={ handleAddClick }
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