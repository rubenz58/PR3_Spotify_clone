import { useEffect, useRef, useState } from 'react';

import useStore from '../../../stores/useStore';
import './AudioPlayer.css';

// HOW IT WORKS
// 1. Song component = just UI + button clicks → updates Zustand state
// 2. Player/AudioPlayer component = reads Zustand state → controls actual audio playback
// 3. HTML5 <audio> element = does the real work of playing the sound

export function AudioPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    volume,
    setVolume,
    playNextSong,
    playPrevSong,
    pendingSong,
    repeatMode,
    restartTrigger,
    setRepeatMode,
    shuffleMode,
    toggleShuffle,
  } = useStore();

  const audioRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleShuffleToggle = () => {
    toggleShuffle();
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    if (audioRef.current && duration) {
      const progressBar = e.currentTarget;
      const clickX = e.clientX - progressBar.offsetLeft;
      const width = progressBar.offsetWidth;
      const newTime = (clickX / width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    if (audioRef.current && restartTrigger > 0) {
        audioRef.current.currentTime = 0;
        if (isPlaying) {
            audioRef.current.play().catch(error => {
                console.log('Restart play failed:', error);
            });
        }
    }
  }, [restartTrigger, isPlaying]);

  const handleRepeatToggle = () => {
    setRepeatMode(!repeatMode);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (currentSong && isPlaying) {
        audioRef.current.play().catch(error => {
          console.log('Play failed:', error);
        });
      } else if (!isPlaying) {
        audioRef.current.pause();
      }
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  if (!currentSong) return null;

  const handlePlayPause = () => {
    togglePlay();
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    // This line sets the green background
    const percentage = newVolume * 100;
    e.target.style.background = `linear-gradient(to right, #1db954 0%, #1db954 ${percentage}%, #535353 ${percentage}%, #535353 100%)`;
  };

  const handlePrevClick = () => {
    if (audioRef.current && currentTime < 3) {
      playPrevSong();
    } else {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  if (!currentSong || pendingSong) return null;

  console.log(`src currentSong: ${currentSong.audio_source}`)


  return (
    <div className="audio-player">
        {/* This is actually PLAYING THE MUSIC */}
        <audio
            ref={audioRef}
            // src={`${process.env.REACT_APP_BASE_URL}/stream/songs/${currentSong.id}`}
            // src={`/stream/songs/${currentSong.id}`}
            src={`${currentSong.audio_source}`}
            onEnded={playNextSong}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
        />
        
        {/* Left side - Song info */}
        <div className="song-info-section">
            <div className="now-playing-text">
                <div className="song-title">{currentSong.title}</div>
                <div className="song-artist">{currentSong.artist}</div>
            </div>
        </div>

        {/* Center - Player controls */}
        <div className="player-controls">
            <div className="control-buttons">
              <button 
                  className={`control-btn ${shuffleMode ? 'active' : ''}`} 
                  title={shuffleMode ? "Shuffle: On" : "Shuffle: Off"} 
                  onClick={handleShuffleToggle}
                  style={{
                      color: shuffleMode ? '#1db954' : 'inherit',
                      opacity: shuffleMode ? 1 : 0.7
                  }}
              >
                  🔀
              </button>
              <button className="control-btn" title="Previous" onClick={handlePrevClick}>
                  ⏮️
              </button>
              <button className="play-pause-btn" onClick={handlePlayPause}>
                  {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button className="control-btn" title="Next" onClick={playNextSong}>
                  ⏭️
              </button>
              <button 
                  className={`control-btn ${repeatMode ? 'active' : ''}`} 
                  title={repeatMode ? "Repeat: On" : "Repeat: Off"} 
                  onClick={handleRepeatToggle}
                  style={{
                      color: repeatMode ? '#1db954' : 'inherit',
                      opacity: repeatMode ? 1 : 0.7
                  }}
              >
                  🔁
              </button>
          </div>
            
            <div className="progress-section">
                <span className="time-display">{formatTime(currentTime)}</span>
                <div
                    className="progress-bar"
                    onClick={handleProgressClick}
                    style={{
                        background: `linear-gradient(to right, #1db954 0%, #1db954 ${progressPercentage}%, #535353 ${progressPercentage}%, #535353 100%)`
                    }}
                />
                <span className="time-display">{formatTime(duration)}</span>
            </div>
        </div>

        {/* Right side - Volume control */}
        <div className="volume-control">
            <span className="volume-icon">🔊</span>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
            />
        </div>
    </div>
  );
}