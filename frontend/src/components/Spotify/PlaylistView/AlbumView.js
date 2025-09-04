import { useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Song } from '../Song';
import useStore from '../../../stores/useStore';
import { MainContentSkeleton } from '../../Utils/MainContentSkeleton';

export function AlbumView({ albumId }) {
  const {
    user,
    currentAlbumSongs,
    currentAlbum,
    authLoading,
    fetchAlbumSongs,
    albumLoading,
  } = useStore();

  useEffect(() => {
    if (user && albumId) {
      fetchAlbumSongs(albumId);
    }
    
  }, [albumId, user]);
  
  if (authLoading || albumLoading) {
    console.log("FLASHING");
    return <MainContentSkeleton />
  };

  if (!user) return <Navigate to="/login" replace/>;

  return (
    <div className="album-view">
      <h1>{currentAlbum?.title || 'Loading...'}</h1>
      <div className="songs-list">
        {currentAlbumSongs?.map(song => (
          <Song 
            key={song.id} 
            song={song}
            context={{ id: albumId, type: "album" }}
            // showRemoveButton={true}
            // onRemove={(song) => removeSongFromCurrentPlaylist(song)}
          />
        ))}
      </div>
    </div>
  );
}