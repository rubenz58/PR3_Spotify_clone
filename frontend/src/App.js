import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';

const AppContent = () => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    // User is logged in, show dashboard
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
    )
  } else {
    // Not logged in, show login form // ADD OPTION FOR SIGNUP

    return (
      <div className='App'>
        <header className='app-header'>
          <h1>My Auth App</h1>
        </header>
        <main>
          <LoginForm/>
        </main>
      </div>
    )
    
  }
}

function App() {
  return (
    <AuthProvider>
      <AppContent/>
    </AuthProvider>
  );
}

export default App;

