import './App.css';
import { useEffect } from 'react';
import useStore from './stores/useStore';
import { BrowserRouter as Router } from "react-router-dom";

/// COMPONENT IMPORT ///
import Navbar from './components/Navbar/Navbar';
import MainContent from './components/MainContent/MainContent';

const AppContent = () => {
  return (
    <div className="App">
        <Navbar/>
        <MainContent/>
    </div>
  );
}

function App() {

  useEffect(() => {
    useStore.getState().checkExistingAuth()
  }, []) 

  return (
      <Router>
        <AppContent/>
      </Router>
  );
}

export default App;

