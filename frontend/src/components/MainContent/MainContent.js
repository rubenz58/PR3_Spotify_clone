import { Routes, Route, Navigate } from "react-router-dom";
import { PublicRoute, ProtectedRoute } from "../RouteProtection";

import LoginForm from "./Authentication/LoginForm/LoginForm";
import SignUpForm from "./Authentication/SignUpForm/SignUpForm";
import GoogleCallback from "./Authentication/GoogleCallback";
import { NotFound } from "../IntroComponents";
import { Dashboard } from "../Dashboard";
import { Layout } from "./Spotify/Layout";


const MainContent = () => {

    return (
        <div className="main-content-container">
            <Routes>
                {/* Public Routes - redirect to dashboard if logged in */}
                <Route path='/login' element={
                    <PublicRoute>
                        {/* {console.log("START: /login")} */}
                        <LoginForm />
                        {/* {console.log("END: /login")}                         */}
                    </PublicRoute>
                }/>
                <Route path='/signup' element={
                    <PublicRoute>
                        {/* {console.log("START: /signup")} */}
                        <SignUpForm />
                        {/* {console.log("END: /signup")} */}
                    </PublicRoute>
                }/>

                <Route path='/auth/callback' element={
                    <PublicRoute>
                        {/* {console.log("START: /auth/callback")} */}
                        <GoogleCallback />
                        {/* {console.log("END: /auth/callback")} */}
                    </PublicRoute>
                }/>

                {/* Protected Routes - redirect to login if not logged in */}
                <Route path='/spotify' element={
                    <ProtectedRoute>
                        {/* {console.log("START: /spotify")} */}
                        <Layout/>
                        {/* <SongList/>
                        <AudioPlayer/> */}
                        {/* {console.log("END: /spotify")} */}
                    </ProtectedRoute>
                }/>

                {/* Protected Routes - redirect to login if not logged in */}
                <Route path='/dashboard' element={
                    <ProtectedRoute>
                        {/* {console.log("START: /dashboard")} */}
                        <Dashboard />
                        {/* {console.log("END: /dashboard")} */}
                    </ProtectedRoute>
                }/>

                {/* Default redirects */}
                <Route path="/" element={<Navigate to="/spotify" replace />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
    
}

export default MainContent;