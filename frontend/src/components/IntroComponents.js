import { useAuth } from "../contexts/AuthContext";
import useStore from "../stores/useStore";
import { Link } from "react-router-dom";

export const LoadingSpinner = () => {
    return <div>Loading...</div>;
}

// components/NotFound/NotFound.js
export const NotFound = () => {
  // const { user } = useAuth();
  const { user } = useStore();
  
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      {user ? (
        <Link to="/dashboard">Go to Dashboard</Link>
      ) : (
        <Link to="/login">Go to Login</Link>
      )}
    </div>
  );
};