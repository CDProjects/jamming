import React, { useState } from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css';

function Playlist({ playlistName, playlistTracks, onNameChange, onRemove, onSave }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleNameClick = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e) => {
    onNameChange(e.target.value);
  };

  const handleNameBlur = () => {
    setIsEditing(false);
  };

  return (
    <div className="Playlist">
      {isEditing ? (
        <input 
          className="Playlist-input" 
          defaultValue={playlistName} 
          onChange={handleNameChange} 
          onBlur={handleNameBlur} 
          autoFocus
        />
      ) : (
        <div className="Playlist-title" onClick={handleNameClick}>
          {playlistName}
        </div>
      )}
      <TrackList tracks={playlistTracks} onRemove={onRemove} isRemoval={true} />
      <button className="Playlist-save" onClick={onSave}>SAVE TO SPOTIFY</button>
    </div>
  );
}

export default Playlist;
