import { useEffect, useRef } from 'react';
import useStore from '../../../../stores/useStore';

// HOW IT WORKS
// 1. Song component = just UI + button clicks → updates Zustand state
// 2. Player/AudioPlayer component = reads Zustand state → controls actual audio playback
// 3. HTML5 <audio> element = does the real work of playing the sound

export function AudioPlayer() {
  const { currentSong, isPlaying } = useStore();
  const audioRef = useRef(null);
  
  useEffect(() => {
    // audioRef.current: points to <audio/> element
    // Check that a DOM element before trying to call methods on it.
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  if (!currentSong) return null;
  
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      background: '#333', 
      color: 'white', 
      padding: '16px',
      display: 'flex',
      alignItems: 'center'
    }}>
      {/* This is actually PLAYING THE MUSIC */}
      <audio 
        ref={audioRef}
        src={`${process.env.REACT_APP_BASE_URL}/stream/songs/${currentSong.id}`}
        onEnded={() => useStore.getState().togglePlay()}
      />
      <div>
        Now playing: {currentSong.title} - {currentSong.artist}
      </div>
    </div>
  );
}

/* import useStore from "../../../stores/useStore";

export function AudioPlayer() {
  const { currentSong, isPlaying, togglePlay } = useStore();

  if (!currentSong) return null
  
  return (
    <div className="player">
      <audio 
        src={`${process.env.REACT_APP_API_BASE_URL}/stream/songs/${currentSong.id}`}
        autoPlay={isPlaying}
        controls
      />
      <div>Now playing: {currentSong.title}</div>
      <button onClick={togglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  )
} */