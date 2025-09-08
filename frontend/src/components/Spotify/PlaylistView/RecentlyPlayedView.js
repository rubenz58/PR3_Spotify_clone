// components/PlaylistView/RecentlyPlayedView.js
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Song } from '../Song';
import useStore from '../../../stores/useStore';
import { MainContentSkeleton } from '../../Utils/MainContentSkeleton';
import "./Playlists.css";

export function RecentlyPlayedView() {
  console.log("RecentlyPlayedView");
  
  const {
    user,
    fetchRecentlyPlayedSongs,
    recentlyPlayedSongs,
    authLoading,
    playlistLoading,
    removeSongFromLikedSongs,
    clearRecentlyPlayed,
  } = useStore();

  const [clearingHistory, setClearingHistory] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRecentlyPlayedSongs();
    }
  }, [user]);

  if (!user) return <Navigate to="/login" replace/>;
  if (authLoading || playlistLoading) return <MainContentSkeleton />;

  const removeSongFromCurrentPlaylist = async (song) => {
    if (removeSongFromLikedSongs) {
      const result = await removeSongFromLikedSongs(song.id);
      if (!result?.success) {
        console.error('Failed to remove song:', result?.error);
      }
    }
  };

  const handleClearHistory = async () => {
    if (!user) return;
    
    // Confirm before clearing
    if (!window.confirm('Are you sure you want to clear your recently played history? This action cannot be undone.')) {
      return;
    }

    setClearingHistory(true);
    try {
      const result = await clearRecentlyPlayed();
      if (result?.success) {
        console.log(`Cleared ${result.deletedCount} songs from recently played`);
      } else {
        console.error('Failed to clear history:', result?.error);
      }
    } catch (error) {
      console.error('Error clearing history:', error);
    } finally {
      setClearingHistory(false);
    }
  };

  return (
    <div className="playlist-view">
      <div className="playlist-header">
        <h1>
          {recentlyPlayedSongs && recentlyPlayedSongs.length > 0
            ? `Recently Played Songs (${recentlyPlayedSongs.length})`
            : 'Recently Played Songs'}
        </h1>
        
        {recentlyPlayedSongs && recentlyPlayedSongs.length > 0 && (
          <button 
            className="clear-history-btn"
            onClick={handleClearHistory}
            disabled={clearingHistory}
            style={{
              marginLeft: 'auto',
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: clearingHistory ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: clearingHistory ? 0.6 : 1
            }}
          >
            {clearingHistory ? 'Clearing...' : 'Clear History'}
          </button>
        )}
      </div>

      <div className="songs-list">
        {recentlyPlayedSongs && recentlyPlayedSongs.length > 0 ? (
          recentlyPlayedSongs.map(song => (
            <Song
              key={song.id}
              song={song}
              showRemoveButton={true}
              onRemove={(song) => removeSongFromCurrentPlaylist(song)}
              context={{ id: "recently_played", type: "recently_played" }}
            />
          ))
        ) : (
          <p>No recently played songs yet. Start playing some songs to see them here!</p>
        )}
      </div>
    </div>
  );
}