// components/SongList/SongList.js
import { useEffect } from "react";

import { Song } from "../Song";
import useStore from "../../../stores/useStore";

export function SongList() {
  const { songs, fetchSongs, songLoading } = useStore();

  console.log("Rendering SongList");
  
  useEffect(() => {
    fetchSongs()
  }, [])
  
  if (songLoading) return <div>Loading songs...</div>
  
  return (
    <div className="song-list">
      {songs.map(song => (
        <Song key={song.id} song={song} />
      ))}
    </div>
  )
}