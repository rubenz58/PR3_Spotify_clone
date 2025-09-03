// components/PlaylistView/PlaylistView.js
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Song } from '../Song';
import useStore from '../../../stores/useStore';
import { MainContentSkeleton } from '../../Utils/MainContentSkeleton';

export function PlaylistView({ playlistId }) {
  const {
    user,
    currentPlaylistSongs,
    fetchPlaylistSongs,
    userPlaylists,
    authLoading,
    playlistLoading,
    removeSongFromPlaylist,
    playlistRefresh,
  } = useStore();
  
  useEffect(() => {
    fetchPlaylistSongs(playlistId);
  }, [playlistId, playlistRefresh]);
  
  // const playlist = playlists.find(p => p.id === parseInt(playlistId));
  const playlist = userPlaylists?.find(p => p.id === parseInt(playlistId));

  if (!user) return <Navigate to="/login" replace/>;
  if (authLoading || playlistLoading) return <MainContentSkeleton />;

  const removeSongFromCurrentPlaylist = async (song) => {
    const result = await removeSongFromPlaylist(playlistId, song.id);
    
    if (!result.success) {
      console.error('Failed to remove song:', result.error);
    }
  };

  return (
    <div className="playlist-view">
      <h1>{playlist?.name || 'Loading...'}</h1>
      <div className="songs-list">
        {currentPlaylistSongs?.map(song => (
          <Song 
            key={song.id} 
            song={song} 
            showRemoveButton={true}
            onRemove={(song) => removeSongFromCurrentPlaylist(song)}
          />
        ))}
      </div>
    </div>
  );
}