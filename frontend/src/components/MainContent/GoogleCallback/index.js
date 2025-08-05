// GoogleCallback
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

import { Dashboard } from "../../Dashboard";

const GoogleCallback = () => {

    const [error, setError] = useState(null);
    const { setUser, setToken, setLoading } = useAuth();
    const navigate = useNavigate();
    const hasProcessed = useRef(false); // Value persists across renders

    // Show loading spinner

    useEffect(() => {
        const handleGoogleCallback = async() => {

            if (hasProcessed.current) return; // Prevent duplicate call of useEffect
            hasProcessed.current = true;

            setLoading(true);

            try {
                // Get the parameters. Code is parsed correctly by URLSearchParams
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');

                if (!code) {
                    setError("No authorization code received from Google");
                    setLoading(false);
                    return;
                }

                console.log("Making post request with code: ", code);

                // Make POST @ /api/auth/google/callback
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/google/callback`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ code })
                });

                const data = await response.json();

                // Check the response
                if (response.ok) {
                    // Regular login
                    // Take and store user and JWT
                    setUser(data.user);
                    setToken(data.token);
                    localStorage.setItem('token', data.token);

                    console.log("Google login succesful");

                    // Redirect to dashboard.
                    // Replace skips the previous callback URL
                    navigate('/dashboard', {replace : true});
                } else {
                    setError(data.error || 'Google login failed');
                    setLoading(false);

                }
            } catch (error) {
                // Backend error
                console.log("Google callback error: ", error);
                setError("Network error during Google login");
            } finally {
                setLoading(false);
            }
        }
        handleGoogleCallback();

    }, [])

    if (error) {
        return <div>Error: {error}</div>;
    }

    return <Dashboard/>;
}

export default GoogleCallback;