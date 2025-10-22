// components/PlaylistView/LikedSongsView.js
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Song } from '../Song';
import useStore from '../../../stores/useStore';
import { MainContentSkeleton } from '../../Utils/MainContentSkeleton';

export function QueueView() {

    console.log("QueueView");

    const {
        user,
        fetchQueueSongs,
        queueSongs,
        authLoading,
        playlistLoading,
        removeSongFromLikedSongs,
        removeFromQueue,
        playlistRefresh,
    } = useStore();

    useEffect(() => {
        if (user) {
            fetchQueueSongs();
        }
    }, [user, playlistRefresh]);

    if (authLoading || playlistLoading) return <MainContentSkeleton />;

    if (!user) return <Navigate to="/login" replace/>;

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
            {queueSongs && queueSongs.length > 0 
            ? `Queue Songs (${queueSongs.length})` 
            : 'Queue Songs'}
        </h1>
        <div className="songs-list">
            {queueSongs && queueSongs.length > 0 ? (
            queueSongs.map(song => (
                <Song
                    key={song.id}
                    song={song}
                    showRemoveButton={true}
                    // onRemove={(song) => removeSongFromCurrentPlaylist(song)}
                    onRemove={(song) => removeFromQueue(song.id)}
                    context={{ id: "queue", type: "queue" }}
                />
            ))
            ) : (
            <p>No queue songs yet. Start queuing some songs to see them here!</p>
            )}
        </div>
        </div>
    );
}