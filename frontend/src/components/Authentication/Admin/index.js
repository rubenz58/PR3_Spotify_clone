import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useStore from '../../../stores/useStore';
import './Admin.css';

const Admin = () => {
    console.log("Admin");
    const { user, makeAuthenticatedRequest } = useStore();
    const [adminData, setAdminData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    console.log(user);
    const isAdmin = user?.is_admin || false;

    // Make the admin API request
    useEffect(() => {
        const fetchAdminData = async () => {
            if (!isAdmin) return; // Don't make request if not admin
            
            setLoading(true);
            setError('');
            
            try {
                const data = await makeAuthenticatedRequest('/api/admin/');
                setAdminData(data);
            } catch (error) {
                setError(error.message);
                console.error('Admin request failed:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [isAdmin, makeAuthenticatedRequest]);

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

    return (
        <div>
            <h1>ADMIN</h1>
            {loading && <p>Loading admin data...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {adminData && (
                <div>
                    <h2>Admin Data:</h2>
                    <pre>{JSON.stringify(adminData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default Admin;