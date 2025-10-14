import { useState, useEffect } from 'react';
import useStore from "../../../stores/useStore";
import { AddToPlaylistDropdown } from './AddToPlaylistDropdown';
import './Song.css';

export function Song({
  song,
  showRemoveButton = false,
  onRemove,
  context = null,
  autoplaySpecific = false
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

  const isCurrentSongInContext = (() => {
    // Only debug if this is the currently playing song
    // if (currentSong?.id === song.id) {
    //   console.log("=== Condition 5 Debug ===");
    //   console.log("currentPlaylistId:", currentPlaylistId, "type:", typeof currentPlaylistId);
    //   console.log("context?.id:", context?.id, "type:", typeof context?.id);
    //   console.log("String(currentPlaylistId):", String(currentPlaylistId));
    //   console.log("String(context?.id):", String(context?.id));
    //   console.log("Are they equal?", String(currentPlaylistId) === String(context?.id));
    //   console.log("=== End Condition 5 Debug ===");
      
    //   const condition1 = currentSong?.id === song.id;
    //   const condition2 = currentContextSong?.id === song.id;
    //   const condition3 = currentContext === context?.type;
    //   const condition4 = !queuePlaying;
    //   const condition5 = currentContext === "playlist" 
    //     ? String(currentPlaylistId) === String(context?.id)
    //     : true;
      
    //   console.log("condition1 (currentSong?.id === song.id):", condition1);
    //   console.log("condition2 (currentContextSong?.id === song.id):", condition2);
    //   console.log("condition3 (currentContext === context?.type):", condition3);
    //   console.log("condition4 (!queuePlaying):", condition4);
    //   console.log("condition5 (playlist ID check):", condition5);
      
    //   const result = condition1 && condition2 && condition3 && condition4 && condition5;
    //   console.log("Final result:", result);
    //   console.log("=== End Debug ===");
      
    //   return result;
    // }
    
    // Regular calculation for non-current songs (no logging)
    return currentSong?.id === song.id &&
      currentContextSong?.id === song.id &&
      currentContext === context?.type &&
      !queuePlaying &&
      (currentContext === "playlist"
        ? String(currentPlaylistId) === String(context?.id)
        : true);
  })();

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (isLiked) {
      await removeLikedSong(song.id);
    } else {
      await addLikedSong(song.id);
    }
  };

  const handlePlayClick = () => {
    // Check if same song is already playing
    if (currentSong?.id === song.id) {
        // Always toggle play/pause first for immediate feedback
        togglePlay();
        
        // Check if context needs to be updated (same song, different playlist/context)
        if (context && (currentContext !== context.type || String(currentPlaylistId) !== String(context.id))) {
            // Same song, but different context - update context for highlighting
            setCurrentContextAndPlaylist(context.type, context.id);
            
            // Get songs and set playback context for new context
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
        return;
    }

    // Different song - set up new context and play
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
        
        // Check if shuffle is on and regenerate if needed
        const { shuffleMode, shuffledContextSongs } = useStore.getState();
        if (shuffleMode && songs.length > 0) {
            if (shuffledContextSongs.length === 0 || 
                shuffledContextSongs.length !== songs.length ||
                !shuffledContextSongs.some(s => s.id === song.id)) {
                
                console.log("Regenerating shuffle on song click");
                
                // Regenerate shuffled playlist with clicked song first
                const otherSongs = songs.filter(s => s.id !== song.id);
                const shuffledOthers = [...otherSongs].sort(() => Math.random() - 0.5);
                const newShuffledPlaylist = [song, ...shuffledOthers];
                
                useStore.setState({ shuffledContextSongs: newShuffledPlaylist });
            }
        }
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

  useEffect(() => {
    if (autoplaySpecific) {
      handlePlayClick();
    }
  }, [autoplaySpecific]);

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