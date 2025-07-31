import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Routes, Route } from "react-router-dom";

import LoginForm from "./LoginForm/LoginForm";
import SignUpForm from "./SignUpForm/SignUpForm";
import { LoadingSpinner } from "../IntroComponents";

// XXXXXX >>>>>> –––––– Add styling file –––––– <<<<<< XXXXXX // 
// Don't need one since the styling doesn't actually happen here //


const MainContent = () => {

    const { user, userIsLoaded, loading } = useAuth();

    if (loading) return <LoadingSpinner/>;
    return (
        <>
            {!userIsLoaded && (
                <Routes>
                    <Route path="/" element={<LoginForm/>}/>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/signup" element={<SignUpForm />} />
                </Routes>
            )}
            {userIsLoaded && (
                <h1>Welcome {user.name}</h1>
            )}
        </>
    );
    
}

export default MainContent;