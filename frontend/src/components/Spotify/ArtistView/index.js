import useStore from "../../../stores/useStore";
import { useEffect } from "react";

export function ArtistView( {artistId}) {
    console.log("ArtistView");
    const {
        user,
        fetchArtistInfo, 
        currentArtist, 
        currentArtistAlbums, 
        artistLoading
    } = useStore();

    useEffect(() => {
        if (artistId && user) {
            fetchArtistInfo(artistId);
        }
    }, [artistId, user]);

    if (artistLoading) return <div>Loading artist...</div>;
    if (!currentArtist) return <div>Artist not found</div>;

    return (
        <div>
        <h1>{currentArtist.name}</h1>
        <p>{currentArtist.bio}</p>
        <div className="albums">
            {currentArtistAlbums.map(album => (
            <div key={album.id}>{album.title}</div>
            ))}
        </div>
        </div>
    );
}