import { Routes, Route, Navigate } from "react-router-dom";

import { SpotifyApp } from "./Spotify/SpotifyApp";


const SpotifyRouter = () => {

    return (
        <>
            <Route path="/" element={<SpotifyApp />} />
            <Route path="/login" element={<SpotifyApp view="login" />} />
            <Route path="/signup" element={<SpotifyApp view="signup" />} />
        </>
    );
    
}

export default SpotifyRouter;