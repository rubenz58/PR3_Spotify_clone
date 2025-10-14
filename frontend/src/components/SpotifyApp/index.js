import { useState, useEffect } from 'react';
import { AudioPlayer } from '../Spotify/AudioPlayer';
import { Header } from '../Spotify/Header';
import { Sidebar } from '../Spotify/Sidebar';
import { RightSidebar } from '../Spotify/RightSidebar';
import { MainContentRouter } from "../Spotify/MainContent/MainContentRouter";
import useStore from '../../stores/useStore';
import './SpotifyApp2.css';

export function SpotifyApp({ view }) {
  const {
    setIsMobile,
    isMobile,
    setMobileActiveTab,
    mobileActiveTab,
  } = useStore();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  const handleTabChange = (tab) => {
    setMobileActiveTab(tab);
  };

  return (
    <div className="spotify-layout">
      {/* Fixed Header */}
      <Header />
      
      {/* Mobile Tabs - Only show on mobile */}
      {isMobile && (
        <div className="mobile-tabs">
          <div className="tab-buttons">
            <button
              className={`tab-btn ${mobileActiveTab === 'library' ? 'active' : ''}`}
              onClick={() => handleTabChange('library')}
            >
              My Library
            </button>
            <button
              className={`tab-btn ${mobileActiveTab === 'playlist' ? 'active' : ''}`}
              onClick={() => handleTabChange('playlist')}
            >
              Current View
            </button>
            <button
              className={`tab-btn ${mobileActiveTab === 'queue' ? 'active' : ''}`}
              onClick={() => handleTabChange('queue')}
            >
              Queue
            </button>
          </div>
        </div>
      )}

      {/* Main Container with 3-column layout */}
      <div className="main-container">
        {/* Left Sidebar - Your Library */}
        <aside className={`left-sidebar content-panel ${
          !isMobile || mobileActiveTab === 'library' ? 'active' : ''
        }`}>
          <Sidebar />
        </aside>

        {/* Main Content Area */}
        <main className={`content-area content-panel ${
          !isMobile || mobileActiveTab === 'playlist' ? 'active' : ''
        }`}>
          <MainContentRouter />
        </main>

        {/* Right Sidebar - Song Info & Queue */}
        <aside className={`right-sidebar content-panel ${
          !isMobile || mobileActiveTab === 'queue' ? 'active' : ''
        }`}>
          <RightSidebar />
        </aside>
      </div>

      <AudioPlayer />
    </div>
  );
}