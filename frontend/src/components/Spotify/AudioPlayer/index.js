import { useEffect, useRef } from 'react';
import useStore from '../../../stores/useStore';

// HOW IT WORKS
// 1. Song component = just UI + button clicks → updates Zustand state
// 2. Player/AudioPlayer component = reads Zustand state → controls actual audio playback
// 3. HTML5 <audio> element = does the real work of playing the sound

export function AudioPlayer() {
  const { currentSong, isPlaying } = useStore();
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

  
  // useEffect(() => {
  //   // audioRef.current: points to <audio/> element
  //   // Check that a DOM element exists before trying to call methods on it.
  //   if (audioRef.current) {
  //     if (isPlaying) {
  //       audioRef.current.play();
  //     } else {
  //       audioRef.current.pause();
  //     }
  //   }
  // }, [isPlaying]);

  // // Have to reset audio element when song changes.
  // useEffect(() => {
  //   if (audioRef.current && currentSong) {
  //     // Song changed, load new source
  //     audioRef.current.load(); // Reset the audio element
  //     if (isPlaying) {
  //       audioRef.current.play();
  //     }
  //   }
  // }, [currentSong]);
  
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