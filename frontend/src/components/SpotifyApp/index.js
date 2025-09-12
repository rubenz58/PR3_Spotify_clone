import { AudioPlayer } from '../Spotify/AudioPlayer';
import { Header } from '../Spotify/Header';
import { Sidebar } from '../Spotify/Sidebar';
import { RightSidebar } from '../Spotify/RightSidebar';
import { MainContentRouter } from "../Spotify/MainContent/MainContentRouter";
import './SpotifyApp.css';

export function SpotifyApp({ view }) {
  // console.log("SpotifyApp");

  return (
    <div className="spotify-layout">
      {/* Fixed Header */}
      <Header />
      
      {/* Main Container with 3-column layout */}
      <div className="main-container">
        {/* Left Sidebar - Your Library */}
        <aside className="left-sidebar">
          <Sidebar />
        </aside>
        
        {/* Main Content Area */}
        <main className="content-area">
          <MainContentRouter/>
        </main>
        
        {/* Right Sidebar - Song Info & Queue */}
        <aside className="right-sidebar">
          <RightSidebar />
        </aside>
      </div>
      
      <AudioPlayer />
    </div>
  );
}