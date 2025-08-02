import { useAuth } from "../../contexts/AuthContext";

export const Dashboard = () => {
    const { user } = useAuth();

    return (
      <div className="App">
        <header className="App-header">
          <h1>My Auth App</h1>
          <div className="user-info">
            <span>Welcome, {user.name}!</span>
          </div>
        </header>
      </div>
    );
}