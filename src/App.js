import React, { useState } from 'react';
import SearchBar from './SearchBar/SearchBar';
import SearchResults from './SearchResults/SearchResults';
import Playlist from './Playlist/Playlist';
import './App.css';

function App() {
  // Mock data for search results
  const [searchResults, setSearchResults] = useState([
    { id: 1, name: 'Track Name 1', artist: 'Artist 1', album: 'Album 1' },
    { id: 2, name: 'Track Name 2', artist: 'Artist 2', album: 'Album 2' },
    // Add more tracks as needed
  ]);

  return (
    <div className="App">
      <SearchBar />
      <div className="App-playlist">
        <SearchResults searchResults={searchResults} />
        <Playlist />
      </div>
    </div>
  );
}

export default App;
