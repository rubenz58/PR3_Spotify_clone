// components/PlaylistView/LikedSongsView.js
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Song } from '../Song';
import useStore from '../../../stores/useStore';
import { MainContentSkeleton } from '../../Utils/MainContentSkeleton';

export function RecentlyPlayedView() {

    console.log("RecentlyPlayedView");

    const {
        user,
        fetchRecentlyPlayedSongs,
        recentlyPlayedSongs,
        authLoading,
        playlistLoading,
        removeSongFromLikedSongs,
    } = useStore();

    useEffect(() => {
        if (user) {
            fetchRecentlyPlayedSongs();
        }
    }, [user]); // Added user as dependency

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

    return (
        <div className="playlist-view">
        <h1>
            {recentlyPlayedSongs && recentlyPlayedSongs.length > 0 
            ? `Recently Played Songs (${recentlyPlayedSongs.length})` 
            : 'Recently Played Songs'}
        </h1>
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