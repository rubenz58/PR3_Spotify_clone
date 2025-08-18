// components/Song/Song.js
import useStore from "../../../stores/useStore";

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
}