import { useState, useEffect } from 'react';
import useStore from '../../../stores/useStore';
import { AddToPlaylistDropdown } from '../Song/AddToPlaylistDropdown';
import { RightSidebarSong } from './RightSidebarSong'; // Import the new component
import './RightSidebar.css';

export function RightSidebar() {
  const {
    user,
    currentSong,
    queueSongs,
    isPlaying,
    playSong,
    removeFromQueue,
    fetchQueueSongs,
    clearQueue,
    likedSongs,
    addLikedSong,
    removeLikedSong,
    fetchLikedSongs,
    setCurrentPlaylistId,
    setCurrentQueueSongId,
    setQueuePlaying,
    queuePlaying,
    currentQueueSongId,
    togglePlay,
  } = useStore();

  useEffect(() => {
    if (user) {
      fetchQueueSongs();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchLikedSongs();
    }
  }, [user]);
  
  const [activeTab, setActiveTab] = useState('queue');
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);

  // Check if current song is liked
  const isCurrentSongLiked = currentSong && likedSongs?.some(likedSong => likedSong.id === currentSong.id);

  const handleClearQueue = async () => {
    if (!user) return;
    await clearQueue();
  };

  const handlePlayFromQueue = async (song) => {
    if (!user) return;

    // Immediately play the clicked song
    playSong(song);

    // Set queuePlaying
    setQueuePlaying(true);

    // Assign currentQueueSongId to song.id
    setCurrentQueueSongId(song.id);

    // Set context to queue // NOOOO NOOOO
    setCurrentPlaylistId("queue");
    // setCurrentContext("queue");

  };

  const handleRemoveFromQueue = (songId) => {
    if (!user) return;
    removeFromQueue(songId);
  };

  const handleLikeClick = async (song) => {
    if (!user) return;

    const isSongLiked = likedSongs?.some(likedSong => likedSong.id === song.id);
    
    if (isSongLiked) {
      await removeLikedSong(song.id);
    } else {
      await addLikedSong(song.id);
    }
  };

  const handleLikeClickCurrentSong = async () => {
    if (!user || !currentSong) return;
    
    if (isCurrentSongLiked) {
      await removeLikedSong(currentSong.id);
    } else {
      await addLikedSong(currentSong.id);
    }
  };

  const handlePlaylistClickNowPlaying = () => {
    if (!user || !currentSong) return;
    setShowPlaylistDropdown(!showPlaylistDropdown);
  };

  return (
    <div className={`right-sidebar ${!user ? 'sidebar-disabled' : ''}`}>
      {/* Current Song Info */}
      {currentSong && (
        <div className="current-song-section">
          <div className="current-song-header">
            <h3>Now Playing</h3>
            <button className="minimize-btn" disabled={!user}>−</button>
          </div>
          
          <div className="current-song-info">
            <div className="album-art">
              <div className="album-placeholder">
                🎵
              </div>
              <div className="playing-indicator">
                {isPlaying && user && (
                  <div className="sound-bars">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="song-details">
              <h4 className="song-title">{currentSong.title}</h4>
              <p className="song-artist">{currentSong.artist}</p>
              {currentSong.album && (
                <p className="song-album">{currentSong.album}</p>
              )}
            </div>
            
            <div className="song-actions">
              <button 
                className="action-btn like-btn" 
                disabled={!user}
                onClick={handleLikeClickCurrentSong}
                title={isCurrentSongLiked ? "Remove from liked songs" : "Add to liked songs"}
              >
                {isCurrentSongLiked ? '💚' : '♡'}
              </button>
              
              <div className="add-to-playlist-container">
                <button 
                  className="action-btn playlist-btn" 
                  disabled={!user}
                  onClick={handlePlaylistClickNowPlaying}
                  title="Add to playlist"
                >
                  +
                </button>
                {showPlaylistDropdown && currentSong && (
                  <AddToPlaylistDropdown
                    showQueue={false}
                    song={currentSong}
                    onClose={() => setShowPlaylistDropdown(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'queue' ? 'active' : ''}`}
          onClick={() => user && setActiveTab('queue')}
          disabled={!user}
        >
          Queue
        </button>
        {/* <button 
          className={`tab-btn ${activeTab === 'lyrics' ? 'active' : ''}`}
          onClick={() => user && setActiveTab('lyrics')}
          disabled={!user}
        >
          Lyrics
        </button> */}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'queue' && (
          <div className="queue-section">
            <div className="queue-header">
              <h4>Next Up</h4>
              {queueSongs && queueSongs.length > 0 && (
                <button 
                  className="clear-queue-btn" 
                  disabled={!user}
                  onClick={handleClearQueue}
                >
                  Clear queue
                </button>
              )}
            </div>
            
            <div className="queue-list">
              {queueSongs && queueSongs.length > 0 ? (
                queueSongs.map((song) => {
                  const isLiked = likedSongs?.some(likedSong => likedSong.id === song.id);
                  
                  // Use the new RightSidebarSong component
                  return (
                    <RightSidebarSong
                      key={song.id}
                      song={song}
                      currentSong={currentSong}
                      isLiked={isLiked}
                      onPlay={handlePlayFromQueue}
                      onRemove={handleRemoveFromQueue}
                      onLike={handleLikeClick}
                      user={user}
                      queuePlaying={queuePlaying}
                      currentQueueSongId={currentQueueSongId}
                      togglePlay={togglePlay}
                    />
                  );
                })
              ) : (
                <div className="empty-queue">
                  <div className="empty-icon">🎵</div>
                  <h4>Your queue is empty</h4>
                  <p>Add songs to your queue to see them here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'lyrics' && (
          <div className="lyrics-section">
            <div className="lyrics-header">
              <h4>Lyrics</h4>
            </div>
            <div className="lyrics-content">
              {currentSong ? (
                <div className="lyrics-placeholder">
                  <div className="lyrics-icon">🎤</div>
                  <p>Lyrics not available</p>
                  <small>We're working on adding lyrics for this song</small>
                </div>
              ) : (
                <div className="no-song-lyrics">
                  <p>Play a song to see lyrics</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}