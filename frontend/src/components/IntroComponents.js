import { useAuth } from "../contexts/AuthContext";

export const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
      <div className="App">
        <header className="App-header">
          <h1>My Auth App</h1>
          <div className="user-info">
            <span>Welcome, {user.name}!</span>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </header>
        <main>
          <h2>Dashboard</h2>
          <p>You are logged in.</p>
        </main>
      </div>
    );
}

export const LoadingSpinner = () => {
    return <div>Loading...</div>;
}