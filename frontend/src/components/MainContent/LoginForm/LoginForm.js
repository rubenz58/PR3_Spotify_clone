import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";

import './LoginForm.css';


const LoginForm = () => {
    // Variables that will hold input information
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { login, loading } = useAuth();

    // As a user types, values displayed will change
    const handleChange = (e) => {
        setFormData({
            ...formData, // Takes previous data
            [e.target.name]: e.target.value // Wherever the user is typing gets updated
        });

        // Clear error when user starts typing
        if (error) setError('');
    };

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

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>

            {error && (
                <div className="error-message">
                        {error}
                </div>
            )}
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
                        className="form-input"
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
                    disabled={loading}
                    className="login-submit-button"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <div className="form-footer">
                    Don't have an account?{' '}
                    <Link to="/signup" className="form-footer-link">
                        Sign up here
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;