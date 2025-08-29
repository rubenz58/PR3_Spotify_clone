// components/Sidebar/PlaylistRename.js
import { useState } from 'react';
import './PlaylistRename.css';

export function PlaylistRename({ playlist, onSave, onCancel }) {
  const [newName, setNewName] = useState(playlist.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      onSave(playlist.id, newName.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="playlist-rename" onClick={(e) => e.stopPropagation()}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="rename-input"
          autoFocus
          maxLength={100}
        />
        <div className="rename-buttons">
          <button type="submit" className="save-rename-btn" disabled={!newName.trim()}>
            Save
          </button>
          <button type="button" className="cancel-rename-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}