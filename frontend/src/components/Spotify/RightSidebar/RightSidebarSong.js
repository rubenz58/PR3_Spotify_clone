import React, { useState } from 'react';
import { AddToPlaylistDropdown } from '../Song/AddToPlaylistDropdown';
import './RightSidebarSong.css'; // We'll create this CSS file next

export function RightSidebarSong({

    song, 
    currentSong, 
    isLiked, 
    onPlay, 
    onRemove, 
    onLike, 
    user,
    queuePlaying,
    currentQueueSongId,
    togglePlay,
}) {
    const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
    
    // Check if this song is currently playing
    // const isCurrentSong = currentSong && currentSong.id === song.id;

    const isCurrentlyPlayingFromQueue = 
        currentSong?.id === song.id && 
        queuePlaying && 
        currentQueueSongId === song.id;
    
    const formatDuration = (seconds) => {
        if (!seconds) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePlayClick = () => {
        // Only toggle if this exact queue song is currently playing from queue
        if (isCurrentlyPlayingFromQueue) {
            togglePlay();
            return;
        }

        // Otherwise, always restart from queue context
        onPlay(song);
    };
    
    const handlePlaylistClick = (e) => {
        e.stopPropagation();
        setShowPlaylistDropdown(!showPlaylistDropdown);
    };
    
    const handleLikeClick = (e) => {
        e.stopPropagation();
        onLike(song);
    };
    
    const handleRemoveClick = (e) => {
        e.stopPropagation();
        onRemove(song.id);
    };
    
    return (
        <div className={`queue-item ${isCurrentlyPlayingFromQueue ? 'current-playing' : ''}`}>
            <div 
                className="queue-song-info" 
                onClick={ handlePlayClick }
                // onClick={() => onPlay(song)}
                style={{ cursor: !user ? 'not-allowed' : 'pointer' }}
            >
                <div className="queue-album-art">🎵</div>
                <div className="queue-details">
                {/* Apply 'playing' class to title when it's the current song */}
                <div className={`queue-title ${isCurrentlyPlayingFromQueue ? 'playing' : ''}`}>
                    {song.title}
                </div>
                <div className="queue-artist">{song.artist}</div>
                </div>
            </div>
            <div className="queue-actions">
                <span className="queue-duration">{formatDuration(song.duration)}</span>
                
                <button 
                className="queue-action-btn like-btn"
                onClick={handleLikeClick}
                disabled={!user}
                title={isLiked ? "Remove from liked songs" : "Add to liked songs"}
                >
                {isLiked ? '💚' : '♡'}
                </button>

                <div className="playlist-dropdown-container">
                <button 
                    className="queue-action-btn playlist-btn"
                    onClick={handlePlaylistClick}
                    disabled={!user}
                    title="Add to playlist"
                >
                    +
                </button>
                {showPlaylistDropdown && (
                    <AddToPlaylistDropdown
                    song={song}
                    onClose={() => setShowPlaylistDropdown(false)}
                    showQueue={false}
                    />
                )}
                </div>
                
                <button 
                    className="remove-btn"
                    onClick={handleRemoveClick}
                    disabled={!user}
                >
                ✕
                </button>
            </div>
        </div>
    );
}