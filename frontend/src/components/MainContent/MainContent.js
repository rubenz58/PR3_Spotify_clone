import { useAuth } from "../../contexts/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginForm from "./LoginForm/LoginForm";
import SignUpForm from "./SignUpForm/SignUpForm";
import { Dashboard, LoadingSpinner } from "../IntroComponents";
import { PublicRoute, ProtectedRoute } from "../RouteProtection";

// XXXXXX >>>>>> –––––– Add styling file –––––– <<<<<< XXXXXX // 
// Don't need one since the styling doesn't actually happen here //


const MainContent = () => {

    const { loading } = useAuth();

    if (loading) return <LoadingSpinner/>;
    return (
        <Routes>
            {/* Public Routes - redirect to dashboard if logged in */}
            <Route path='/login' element={
                <PublicRoute>
                    <LoginForm />
                </PublicRoute>
            }/>
            <Route path='/signup' element={
                <PublicRoute>
                    <SignUpForm />
                </PublicRoute>
            }/>

            {/* Protected Routes - redirect to login if not logged in */}
            <Route path='/dashboard' element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            }/>

            {/* Default redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
    
}

export default MainContent;