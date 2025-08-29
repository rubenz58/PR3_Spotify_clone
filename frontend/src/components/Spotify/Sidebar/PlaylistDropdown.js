// components/Sidebar/PlaylistDropdown.js
import { useState, useRef, useEffect } from 'react';
import './PlaylistDropdown.css';

export function PlaylistDropdown({ playlist, onDelete, onRename }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownClick = (e) => {
    e.stopPropagation(); // Prevent playlist click event
    setIsOpen(!isOpen);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(playlist);
    setIsOpen(false);
  };

  const handleRename = (e) => {
    e.stopPropagation();
    onRename(playlist);
    setIsOpen(false);
  };

  return (
    <div className="playlist-dropdown" ref={dropdownRef}>
      <button 
        className="dropdown-trigger"
        onClick={handleDropdownClick}
        title="More options"
      >
        ⋯
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <button className="dropdown-item delete" onClick={handleDelete}>
            Delete playlist
          </button>
          <button className="dropdown-item rename" onClick={handleRename}>
            Rename
          </button>
        </div>
      )}
    </div>
  );
}