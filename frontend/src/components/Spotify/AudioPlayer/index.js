import { useEffect, useRef } from 'react';
import useStore from '../../../stores/useStore';
import './AudioPlayer.css';

// HOW IT WORKS
// 1. Song component = just UI + button clicks → updates Zustand state
// 2. Player/AudioPlayer component = reads Zustand state → controls actual audio playback
// 3. HTML5 <audio> element = does the real work of playing the sound

export function AudioPlayer() {
  const { currentSong, isPlaying, togglePlay } = useStore();
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

  if (!currentSong) return null;

  const handlePlayPause = () => {
    togglePlay();
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
    </div>
  );
}