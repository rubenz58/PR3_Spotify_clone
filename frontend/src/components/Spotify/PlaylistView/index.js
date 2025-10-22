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
    currentContext,
    fetchHardcodedPlaylists,
    hardcodedPlaylists,
  } = useStore();

  useEffect(() => {
    fetchPlaylistSongs(playlistId);
  }, [playlistId, playlistRefresh]);

  useEffect(() => {
    fetchHardcodedPlaylists();
  }, [user]);

  useEffect(() => {
    if (playlistId && user) {
      // Update currentPlaylistId when viewing a different playlist
      const {
        currentPlaylistId,
        setCurrentContextAndPlaylist
      } = useStore.getState();
      
      if (String(currentPlaylistId) !== String(playlistId) && currentContext === "playlist") {
        setCurrentContextAndPlaylist("playlist", playlistId);
      }
      
      fetchPlaylistSongs(playlistId);
    }
  }, [playlistId, user]);

  const hardcodedPlaylist = hardcodedPlaylists?.find(p => p.id === parseInt(playlistId));
  const userPlaylist = userPlaylists?.find(p => p.id === parseInt(playlistId));
  const playlist = hardcodedPlaylist || userPlaylist;
  
  if (authLoading || playlistLoading) return <MainContentSkeleton />;
  if (!user) return <Navigate to="/login" replace/>;
  

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
            showRemoveButton={!hardcodedPlaylist}
            onRemove={(song) => removeSongFromCurrentPlaylist(song)}
            context={{ id: playlistId, type: "playlist" }}
          />
        ))}
      </div>
    </div>
  );
}