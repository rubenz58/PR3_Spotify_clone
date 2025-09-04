import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import useStore from "../../../stores/useStore";
import { LoadingSpinner } from "../../Utils/Utils";
import { MainContentSkeleton } from "../../Utils/MainContentSkeleton";
import './LoginForm.css';


const LoginForm = () => {
    // console.log("LoginForm!");

    // Variables that will hold input information
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    // If any value in a used CONTEXT CHANGES, it triggers a rerender 
    // of that component. That's why loading gets re-rendered while
    // waiting for something like login()
    const { user, login, loginWithGoogle, authLoading } = useStore();

    if (authLoading) return <MainContentSkeleton/>;
    if (user) return <Navigate to="/" replace/>;

    // As a user types, values displayed will change
    const handleChange = (e) => {
        setFormData({
            ...formData, // Takes previous data
            [e.target.name]: e.target.value // Wherever the user is typing gets updated
        });

        // Clear error when user starts typing
        if (error) setError('');
    };

    // REGULAR LOGIN
    const handleSubmit = async (e) => {
        // Prevents the form from being submitted as an HTML form
        // Logic is handled here in JS
        // With HTML there would be a page redirect, whereas here we stay on the page
        e.preventDefault();

        const result = await login(formData);

        if (!result.success) {
            setError(result.error);
        }
    };

    // GOOGLE LOGIN
    const handleGoogleLogin = async() => {
        setError('');

        console.log("handleGoogleLogin triggered");

        // User is being redirect after loginWithGoogle, so they never return.
        // result.success never given a value.
        const result = await loginWithGoogle();

        if (result && !result.success) {
            setError(result.error);
        }
        // If successful, AuthContext updates user state automatically
    }

    return (
        <div className={`login-container ${authLoading ? 'login-container-loading' : ''}`}>
            <h2 className="login-title">Login</h2>

            {error && (
                <div className="error-message">
                        {error}
                </div>
            )}

            {/* Google Login button */}
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={authLoading}
                className="google-login-btn"
            >
                {!authLoading && <div className="google-icon"></div>}
                {authLoading ? "" : "Continue with Google"}
            </button>
            <div className="form-divider">
                <span>or</span>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        Email:
                    </label>
                    <input
                        type="email" // Browser knows type. Additional validation
                        // This plus htmlFor -> Label clicks work
                        id="email" // Connects to htmlFor. 
                        name="email" // formData gets correct property names
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input login-form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />
                </div>

                <button
                    type="submit"
                    disabled={authLoading}
                    className="login-submit-button"
                >
                    {authLoading ? "Logging in..." : "Login"}
                </button>

                <div className="form-footer">
                    Don't have an account?{' '}
                    <Link to="/signup" className="login-form-footer-link">
                        Sign up here
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;