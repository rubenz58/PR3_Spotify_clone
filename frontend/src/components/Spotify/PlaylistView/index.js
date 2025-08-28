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
    playlists,
    authLoading,
    playlistLoading,
  } = useStore();
  
  useEffect(() => {
    fetchPlaylistSongs(playlistId);
  }, [playlistId]);
  
  // const playlist = playlists.find(p => p.id === parseInt(playlistId));
  const playlist = playlists?.find(p => p.id === parseInt(playlistId));

  if (!user) return <Navigate to="/login" replace/>;
  if (authLoading || playlistLoading) return <MainContentSkeleton />;

  return (
    <div className="playlist-view">
      <h1>{playlist?.name || 'Loading...'}</h1>
      <div className="songs-list">
        {currentPlaylistSongs?.map(song => (
          <Song key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
}