// components/Header/Header.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../../stores/useStore';
import './Header.css';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!user) return; // Prevent search if not logged in
    console.log('Searching for:', searchQuery);
  };

  const handleSearchChange = (e) => {
    if (!user) return; // Prevent typing if not logged in
    setSearchQuery(e.target.value);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <header className={`header ${!user ? 'header-disabled' : ''}`}>
      <div className="header-left">
        <button 
          className="home-button" 
          onClick={handleHomeClick}
          disabled={!user}
          title="Home"
        >
          🏠
        </button>
        <div className="logo">
          🎵 <span className="logo-text">Spotify Clone</span>
        </div>
      </div>

      <div className="header-center">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-container">
            <input
              type="text"
              className={`search-input ${!user ? 'search-input-disabled' : ''}`}
              placeholder={user ? "Search for songs, artists, or albums..." : "Log in to search"}
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={!user}
            />
            <button
              type="submit"
              className={`search-button ${!user ? 'search-button-disabled' : ''}`}
              disabled={!user}
            >
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