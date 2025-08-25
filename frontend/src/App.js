import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import useStore from './stores/useStore';

/// COMPONENT IMPORT ///
import SpotifyRouter from './components/SpotifyRouter';

const AppContent = () => {
  return (
    <div className="App">
        <SpotifyRouter/>
    </div>
  );
}

function App() {
  const loading = useStore(state => state.loading);

  useEffect(() => {
    useStore.getState().checkExistingAuth()
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // This returns immediately.
  // ORDER.
  // 1. RENDER PHASE. JSX evaluated and returned. Immediately.
  // 2. COMMIT PHASE. DOM gets updated.
  // 3. EFFECT PHASE. useEffect callback runs.
  // So have to use LOADING temp states to correctly direct
  // the flow of traffic.
  return (
      <Router>
        <AppContent/>
      </Router>
  );
}

export default App;

