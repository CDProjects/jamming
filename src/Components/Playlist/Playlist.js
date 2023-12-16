import React from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css';

function Playlist({ playlistName, playlistTracks }) {
  return (
    <div className="Playlist">
      <input defaultValue={playlistName} />
      <TrackList tracks={playlistTracks} isRemoval={true} />
      <button className="Playlist-save">SAVE TO SPOTIFY</button>
    </div>
  );
}

export default Playlist;
