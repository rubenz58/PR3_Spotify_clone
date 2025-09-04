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

export const MainContentRouter = ({ view }) => {

    // console.log("MainContentRouter");

    // Handling the different cases for routing here.
    const location = useLocation();

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
        // console.log("-> /albums/", albumId);
        return <AlbumView albumId={albumId} />;
    }
    
    return <MainContent />;
    
}

export default MainContentRouter;