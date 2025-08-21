import useStore from "../../../../stores/useStore";
import './Song.css';

// This is just UI. Updates Zustand state.

export function Song({ song }) {
  const { currentSong, isPlaying, playSong, togglePlay } = useStore();
  
  const handlePlayClick = () => {
    if (currentSong?.id === song.id) {
      // If this song is already current, toggle play/pause
      togglePlay();
    } else {
      // If different song, start playing this one
      playSong(song);
    }
  };
  
  const isCurrentSong = currentSong?.id === song.id;
  
  return (
    <div className="song-row">
      <button 
        className="play-button"
        onClick={handlePlayClick}
      >
        {isCurrentSong && isPlaying ? '⏸️' : '▶️'}
      </button>
      
      <div className="song-info">
        <div className="song-title">{song.title}</div>
        <div className="song-artist">{song.artist}</div>
      </div>
      
      <div className="song-duration">
        {song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : '--:--'}
      </div>
    </div>
  );
}



/* import useStore from "../../../stores/useStore";

export function Song({ song }) {
  const { currentSong, isPlaying, playSong } = useStore();

  console.log("Rendering Song");
  
  const handlePlay = () => {
    playSong(song)
  }
  
  const isCurrentSong = currentSong?.id === song.id
  
  return (
    <div className="song-item">
      <div className="song-info">
        <h4>{song.title}</h4>
        <p>{song.artist}</p>
      </div>
      <button onClick={handlePlay}>
        {isCurrentSong && isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  )
} */