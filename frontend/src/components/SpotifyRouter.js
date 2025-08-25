import { Routes, Route, Navigate } from "react-router-dom";

import { SpotifyApp } from "./SpotifyApp";


const SpotifyRouter = () => {

    console.log("SpotifyRouter");

    return (
        <>
            <Routes>
                <Route path="/" element={<SpotifyApp />} />
                <Route path="/login" element={<SpotifyApp view="login" />} />
                <Route path="/signup" element={<SpotifyApp view="signup" />} />
            </Routes>
        </>
    );
    
}

export default SpotifyRouter;