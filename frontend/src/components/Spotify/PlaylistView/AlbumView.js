import { useEffect, useMemo } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

import { Song } from '../Song';
import useStore from '../../../stores/useStore';
import { MainContentSkeleton } from '../../Utils/MainContentSkeleton';

export function AlbumView({ albumId }) {
  const [searchParams] = useSearchParams();
  const shouldAutoplay = searchParams.get('autoplay') === 'true';
  const playSongId = searchParams.get('play_song');

  const {
    user,
    currentAlbumSongs,
    currentAlbum,
    authLoading,
    fetchAlbumSongs,
    albumLoading,
    playSong,
    setCurrentContextAndPlaylist,
    setPlaybackContext,
  } = useStore();

  useEffect(() => {
    if (user && albumId) {
      fetchAlbumSongs(albumId);
    }
  }, [albumId, user]);

  useEffect(() => {
  if (shouldAutoplay && currentAlbumSongs && currentAlbumSongs.length > 0) {
    // Calls store's play function directly with the first song
    const firstSong = currentAlbumSongs[0];
    // Assuming you have access to the same play logic
    playSong(firstSong);
    setCurrentContextAndPlaylist("album", albumId);
    setPlaybackContext(currentAlbumSongs, firstSong);
  }
}, [shouldAutoplay, currentAlbumSongs]);

  
  if (authLoading || albumLoading) {
    // console.log("FLASHING");
    return <MainContentSkeleton />
  };

  if (!user) return <Navigate to="/login" replace/>;

  return (
    <div className="album-view">
      <h1>{currentAlbum?.title || 'Loading...'}</h1>
      <div className="songs-list">
        {currentAlbumSongs?.map((song, index) => (
          <Song 
            key={song.id} 
            song={song}
            context={{ id: albumId, type: "album" }}
            autoplaySpecific={playSongId && String(song.id) === String(playSongId)}
            // showRemoveButton={true}
            // onRemove={(song) => removeSongFromCurrentPlaylist(song)}
          />
        ))}
      </div>
    </div>
  );
}