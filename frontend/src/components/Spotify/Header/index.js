// components/Header/Header.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useStore from '../../../stores/useStore';
import { SearchResults } from './SearchResults';
import './Header.css';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    user, 
    logout, 
    performSearch, 
    searchResults, 
    searchLoading,
    clearSearchResults,
    setMobileActiveTab,
 
  } = useStore();

  const navigate = useNavigate();

  // Debounced search - wait 300ms after user stops typing
  useEffect(() => {
    if (!user) return;
    
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        clearSearchResults();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!user || !searchQuery.trim()) return;
    // Search is already triggered by useEffect, but we can force it here if needed
    performSearch(searchQuery);
  };

  const handleSearchChange = (e) => {
    if (!user) return;
    setSearchQuery(e.target.value);
  };

  const handleHomeClick = () => {
    setMobileActiveTab('playlist');
    navigate('/');
  };


  return (
    <header className={`header ${!user ? 'header-disabled' : ''}`}>
      <div className="header-left">
        <button
          className="home-button"
          onClick={ handleHomeClick }
          disabled={!user}
          title="Home"
        >
          🏠
        </button>
        {/* <div className="logo">
          🎵 <span className="logo-text">Spotify Clone</span>
        </div> */}
      </div>

      <div className="header-center">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-container">
            <input
              type="text"
              className={`search-input ${!user ? 'search-input-disabled' : ''}`}
              placeholder={user ? "Search for songs, artists, or albums..." : "Log in to search"}
              value= { searchQuery }
              onChange= { handleSearchChange }
              disabled= { !user }
            />
            <button
              type="submit"
              className={`search-button ${!user ? 'search-button-disabled' : ''}`}
              disabled={!user}
            >
              🔍
            </button>

            {/* Search Results Dropdown */}
            {user && searchQuery && (
              <SearchResults
                searchResults={searchResults}
                searchLoading={searchLoading}
                onResultClick={() => {
                  setSearchQuery('');
                  clearSearchResults();
                }}
              />
            )}
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