// components/PlaylistView/PlaylistView.js
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Song } from '../Song';
import useStore from '../../../stores/useStore';
import { MainContentSkeleton } from '../../Utils/MainContentSkeleton';

import "./PlaylistView.css";

export function PlaylistView({ playlistId }) {
  const {
    user,
    currentPlaylistSongs,
    fetchPlaylistSongs,
    playlists,
    specialPlaylists,
    authLoading,
    playlistLoading,
    removeSongFromPlaylist,
  } = useStore();

  useEffect(() => {
    fetchPlaylistSongs(playlistId);
  }, [playlistId]);

  // Find playlist in either user playlists or special playlists
  const playlist = 
    playlists?.find(p => p.id === parseInt(playlistId)) ||
    specialPlaylists?.find(p => p.id === parseInt(playlistId));

  if (!user) return <Navigate to="/login" replace/>;
  if (authLoading || playlistLoading) return <MainContentSkeleton />;

  // Check if this is a special playlist (not editable)
  const isSpecialPlaylist = playlist?.playlist_type && playlist.playlist_type !== 'user_created';
  const canRemoveSongs = !isSpecialPlaylist && playlist?.is_editable !== false;

  const removeSongFromCurrentPlaylist = async (song) => {
    // Prevent removal from special playlists
    if (!canRemoveSongs) {
      console.warn('Cannot remove songs from this playlist');
      return;
    }

    const result = await removeSongFromPlaylist(playlistId, song.id);
    if (!result.success) {
      console.error('Failed to remove song:', result.error);
    }
  };

  // Get appropriate header info based on playlist type
  const getPlaylistHeader = () => {
    if (!playlist) return 'Loading...';
    
    switch (playlist.playlist_type) {
      case 'liked_songs':
        return {
          title: 'Liked Songs',
          subtitle: 'Songs you\'ve liked',
          icon: '💚'
        };
      case 'queue':
        return {
          title: 'Queue',
          subtitle: 'Up next',
          icon: '📋'
        };
      case 'recently_played':
        return {
          title: 'Recently Played',
          subtitle: 'Your recent listening history',
          icon: '🕒'
        };
      default:
        return {
          title: playlist.name,
          subtitle: `Playlist • ${playlist.song_count || 0} songs`,
          icon: '🎵'
        };
    }
  };

  const headerInfo = getPlaylistHeader();

  return (
    <div className="playlist-view">
      <div className="playlist-header">
        <div className="playlist-icon-large">{headerInfo.icon}</div>
        <div className="playlist-info">
          <h1>{headerInfo.title}</h1>
          <p className="playlist-subtitle">{headerInfo.subtitle}</p>
          {playlist?.song_count !== undefined && (
            <span className="song-count">{playlist.song_count} songs</span>
          )}
        </div>
      </div>

      <div className="songs-list">
        {currentPlaylistSongs?.length > 0 ? (
          currentPlaylistSongs.map(song => (
            <Song
              key={song.id}
              song={song}
              showRemoveButton={canRemoveSongs}
              onRemove={canRemoveSongs ? (song) => removeSongFromCurrentPlaylist(song) : undefined}
              playlistType={playlist?.playlist_type}
            />
          ))
        ) : (
          <div className="empty-playlist">
            <div className="empty-playlist-icon">🎵</div>
            <h3>No songs in this playlist</h3>
            <p>
              {isSpecialPlaylist 
                ? getEmptyMessageForSpecialPlaylist(playlist.playlist_type)
                : 'Add songs to get started!'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function for empty state messages
function getEmptyMessageForSpecialPlaylist(playlistType) {
  switch (playlistType) {
    case 'liked_songs':
      return 'Like songs to see them here';
    case 'queue':
      return 'Add songs to your queue to see them here';
    case 'recently_played':
      return 'Your recently played songs will appear here';
    default:
      return 'No songs yet';
  }
}