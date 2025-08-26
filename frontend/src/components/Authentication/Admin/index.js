import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import useStore from '../../../stores/useStore';
import './Admin.css';

const Admin = () => {
    console.log("Admin");
    
    const { user, adminLoading } = useStore();

    console.log(user);

    const isAdmin = user?.is_admin || false;

    // If not logged in, redirect to login
    if (!user) {
        console.log(": No User -> /login");
        return <Navigate to="/login" replace />;
    }

    // If not admin, show unauthorized
    if (!isAdmin) {
        return (
            <div className="unauthorized-container">
                <div className="unauthorized-content">
                    <h1 className="unauthorized-title">Access Denied</h1>
                    <p className="unauthorized-message">You don't have admin privileges to access this page.</p>
                </div>
            </div>
        );
    }

    return (<h1>ADMIN</h1>);
}

export default Admin;