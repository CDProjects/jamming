import React from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css';

function Playlist({ playlistName, playlistTracks, onNameChange, onRemove }) {
  return (
    <div className="Playlist">
      <input defaultValue={playlistName} onChange={e => onNameChange(e.target.value)} />
      <TrackList tracks={playlistTracks} onRemove={onRemove} isRemoval={true} />
      <button className="Playlist-save">SAVE TO SPOTIFY</button>
    </div>
  );
}

export default Playlist;

