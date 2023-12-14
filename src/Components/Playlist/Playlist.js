import React from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css';

function Playlist() {
  // Mock data
  const playlistTracks = [
    { id: 3, name: 'Track 3', artist: 'Artist 3', album: 'Album 3' },
    { id: 4, name: 'Track 4', artist: 'Artist 4', album: 'Album 4' }
    // Add more mock tracks
  ];

  return (
    <div className="Playlist">
      <input defaultValue={'New Playlist'} />
      <TrackList tracks={playlistTracks} isRemoval={true} />
      <button className="Playlist-save">SAVE TO SPOTIFY</button>
    </div>
  );
}

export default Playlist;
