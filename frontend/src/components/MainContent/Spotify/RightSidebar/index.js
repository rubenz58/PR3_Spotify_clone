// components/RightSidebar/RightSidebar.js
import { useState } from 'react';
import useStore from '../../../../stores/useStore';
import './RightSidebar.css';

export function RightSidebar() {
  const { currentSong, queue, isPlaying, playSong, removeFromQueue } = useStore();
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' or 'lyrics'

  const handlePlayFromQueue = (song, index) => {
    playSong(song);
    // TODO: Also remove played songs from queue and update queue position
  };

  const handleRemoveFromQueue = (index) => {
    removeFromQueue(index);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="right-sidebar">
      {/* Current Song Info */}
      {currentSong && (
        <div className="current-song-section">
          <div className="current-song-header">
            <h3>Now Playing</h3>
            <button className="minimize-btn">−</button>
          </div>
          
          <div className="current-song-info">
            <div className="album-art">
              <div className="album-placeholder">
                🎵
              </div>
              <div className="playing-indicator">
                {isPlaying && (
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
              <button className="action-btn like-btn">💚</button>
              <button className="action-btn options-btn">⋯</button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'queue' ? 'active' : ''}`}
          onClick={() => setActiveTab('queue')}
        >
          Queue
        </button>
        <button 
          className={`tab-btn ${activeTab === 'lyrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('lyrics')}
        >
          Lyrics
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'queue' && (
          <div className="queue-section">
            <div className="queue-header">
              <h4>Next Up</h4>
              {queue && queue.length > 0 && (
                <button className="clear-queue-btn">Clear queue</button>
              )}
            </div>
            
            <div className="queue-list">
              {queue && queue.length > 0 ? (
                queue.map((song, index) => (
                  <div key={`${song.id}-${index}`} className="queue-item">
                    <div className="queue-song-info" onClick={() => handlePlayFromQueue(song, index)}>
                      <div className="queue-album-art">🎵</div>
                      <div className="queue-details">
                        <div className="queue-title">{song.title}</div>
                        <div className="queue-artist">{song.artist}</div>
                      </div>
                    </div>
                    <div className="queue-actions">
                      <span className="queue-duration">{formatDuration(song.duration)}</span>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveFromQueue(index)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
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