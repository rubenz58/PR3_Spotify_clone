// components/Layout/Layout.js
import { AudioPlayer } from '../Spotify/AudioPlayer';
import { SongList } from '../Spotify/SongList';
import { Header } from '../Spotify/Header';
import { Sidebar } from '../Spotify/Sidebar';
import { RightSidebar } from '../Spotify/RightSidebar';
import { MainContentRouter } from "../Spotify/MainContent/MainContentRouter";
import './SpotifyApp.css';

export function SpotifyApp({ view }) {
  console.log("SpotifyApp");

  return (
    <div className="spotify-layout">
      {/* Fixed Header */}
      <Header />
      {/* <SongList/> */}
      
      {/* Main Container with 3-column layout */}
      <div className="main-container">
        {/* Left Sidebar - Your Library */}
        <aside className="left-sidebar">
          <Sidebar />
        </aside>
        
        {/* Main Content Area */}
        <main className="content-area">
          <MainContentRouter view = {view}/>
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