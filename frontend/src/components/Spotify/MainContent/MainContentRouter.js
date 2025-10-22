import { useLocation } from "react-router-dom";

import { MainContent } from "./";
import LoginForm from "../../Authentication/LoginForm/LoginForm";
import SignupForm from "../../Authentication/SignUpForm/SignUpForm";
import Admin from "../../Authentication/Admin";
import { PlaylistView } from "../PlaylistView";
import { LikedSongsView } from "../PlaylistView/LikedSongsView";
import { QueueView } from "../PlaylistView/QueueView";
import { RecentlyPlayedView } from "../PlaylistView/RecentlyPlayedView";
import { AlbumView } from "../PlaylistView/AlbumView";
import { ArtistView } from "../ArtistView";


export const MainContentRouter = ({ view }) => {

    // Handling the different cases for routing here.
    const location = useLocation();
    const user = useStore(state => state.user);
    const authLoading = useStore(state => state.authLoading);
    
    console.log('=== ROUTER DEBUG ===');
    console.log('Path:', location.pathname);
    console.log('User:', user);
    console.log('Auth Loading:', authLoading);
    console.log('==================');

    if (location.pathname === '/login') {
        return <LoginForm />;
    }
    
    if (location.pathname === '/signup') {
        return <SignupForm />;
    }
    
    if (location.pathname === '/admin') {
        return <Admin />;
    }

    if (location.pathname === '/liked-songs') {
        return <LikedSongsView />;
    }

    if (location.pathname === '/recently-played') {
        return <RecentlyPlayedView />;
    }

    if (location.pathname === '/queue') {
        return <QueueView />;
    }

    if (location.pathname.startsWith('/playlist/')) {
        const playlistId = location.pathname.split('/')[2];
        return <PlaylistView playlistId={playlistId} />;
    }

    if (location.pathname.startsWith('/albums/')) {
        const albumId = location.pathname.split('/')[2];
        return <AlbumView albumId={albumId} />;
    }

    if (location.pathname.startsWith('/artist/')) {
        const artistId = location.pathname.split('/')[2];
        return <ArtistView artistId={artistId} />;
    }
    
    return <MainContent />;
    
}

export default MainContentRouter;