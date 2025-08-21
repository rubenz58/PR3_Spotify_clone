// components/Header/Header.js
import { useState } from 'react';
import useStore from '../../../../stores/useStore';
import './Header.css';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useStore();

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // TODO: Add real-time search suggestions
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          🎵 <span className="logo-text">Spotify Clone</span>
        </div>
      </div>

      <div className="header-center">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search for songs, artists, or albums..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit" className="search-button">
              🔍
            </button>
          </div>
        </form>
      </div>

      <div className="header-right">
        <div className="user-section">
          {user ? (
            <>
              <span className="user-name">Hello, {user.name}</span>
              <button className="logout-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <span className="user-name">Not logged in</span>
          )}
        </div>
      </div>
    </header>
  );
}