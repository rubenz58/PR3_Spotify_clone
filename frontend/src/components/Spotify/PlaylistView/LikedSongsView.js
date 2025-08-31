// components/PlaylistView/LikedSongsView.js
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Song } from '../Song';
import useStore from '../../../stores/useStore';
import { MainContentSkeleton } from '../../Utils/MainContentSkeleton';

export function LikedSongsView() {

    console.log("LikedSongsView");

    const {
        user,
        fetchLikedSongs,
        likedSongs,
        authLoading,
        playlistLoading, // Fixed typo: was userPlaylistLoading
        removeSongFromLikedSongs,
    } = useStore();

    useEffect(() => {
        if (user) {
            fetchLikedSongs();
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
            {likedSongs && likedSongs.length > 0 
            ? `Liked Songs (${likedSongs.length})` 
            : 'Liked Songs'}
        </h1>
        <div className="songs-list">
            {likedSongs && likedSongs.length > 0 ? (
            likedSongs.map(song => (
                <Song
                key={song.id}
                song={song}
                showRemoveButton={true}
                onRemove={(song) => removeSongFromCurrentPlaylist(song)}
                />
            ))
            ) : (
            <p>No liked songs yet. Start liking some songs to see them here!</p>
            )}
        </div>
        </div>
    );
}