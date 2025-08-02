import { useAuth } from "../../contexts/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginForm from "./LoginForm/LoginForm";
import SignUpForm from "./SignUpForm/SignUpForm";
import { LoadingSpinner, NotFound } from "../IntroComponents";
import { Dashboard } from "../Dashboard";
import { PublicRoute, ProtectedRoute } from "../RouteProtection";

// XXXXXX >>>>>> –––––– Add styling file –––––– <<<<<< XXXXXX // 
// Don't need one since the styling doesn't actually happen here //


const MainContent = () => {

    const { loading } = useAuth();

    if (loading) return <LoadingSpinner/>;
    return (
        <div className="main-content-container">
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

                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
    
}

export default MainContent;