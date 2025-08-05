import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router } from "react-router-dom";

/// COMPONENT IMPORT ///
import Navbar from './components/Navbar/Navbar';
import MainContent from './components/MainContent/MainContent';

const AppContent = () => {
  return (
    <div className="App">
      {/* Your forms will float beautifully here */}
        <Navbar/>
        <MainContent/>
    </div>
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

