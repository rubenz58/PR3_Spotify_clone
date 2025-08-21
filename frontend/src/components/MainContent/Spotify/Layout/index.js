// components/Layout/Layout.js
import { AudioPlayer } from "../AudioPlayer";
import { SongList } from "../SongList";
import { MiddleContent } from "../MiddleContent";
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { RightSidebar } from '../RightSidebar';
import './Layout.css';

export function Layout({ children }) {
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
          {children}
          <MiddleContent/>
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