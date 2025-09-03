import { useEffect, useRef } from 'react';
import useStore from '../../../stores/useStore';
import './AudioPlayer.css';

// HOW IT WORKS
// 1. Song component = just UI + button clicks → updates Zustand state
// 2. Player/AudioPlayer component = reads Zustand state → controls actual audio playback
// 3. HTML5 <audio> element = does the real work of playing the sound

export function AudioPlayer() {
  const { currentSong, isPlaying, togglePlay, volume, setVolume } = useStore();
  const audioRef = useRef(null);

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

  return (
    <div className="audio-player">
      {/* This is actually PLAYING THE MUSIC */}
      <audio
        ref={audioRef}
        src={`${process.env.REACT_APP_BASE_URL}/stream/songs/${currentSong.id}`}
        onEnded={() => useStore.getState().togglePlay()}
      />
      
      {/* Play/Pause Button */}
      <button className="play-pause-btn" onClick={handlePlayPause}>
        {isPlaying ? '⏸️' : '▶️'}
      </button>

      <div className="now-playing-text">
        Now playing: {currentSong.title} - {currentSong.artist}
      </div>

      {/* Volume Control */}
      <div className="volume-control">
        <span className="volume-icon">🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={ handleVolumeChange }
          className="volume-slider"
        />
      </div>
    </div>
  );
}