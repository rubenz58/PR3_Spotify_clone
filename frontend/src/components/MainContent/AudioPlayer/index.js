import useStore from "../../../stores/useStore";

export function AudioPlayer() {
  const { currentSong, isPlaying, togglePlay } = useStore();

  console.log("Rendering SongList");
  
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
}