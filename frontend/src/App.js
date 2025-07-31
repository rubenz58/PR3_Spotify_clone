import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BrowserRouter as Router } from "react-router-dom";

/// COMPONENT IMPORT ///
import Navbar from './components/Navbar/Navbar';
import MainContent from './components/MainContent/MainContent';

const AppContent = () => {
  return (
    <>
      <Navbar/>
      <MainContent/>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent/>
      </Router>
    </AuthProvider>
  );
}

export default App;

