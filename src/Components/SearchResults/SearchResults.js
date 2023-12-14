import React from 'react';
import TrackList from '../TrackList/TrackList';
import './SearchResults.css';

function SearchResults() {
  // Mock data
  const searchResults = [
    { id: 1, name: 'Track 1', artist: 'Artist 1', album: 'Album 1' },
    { id: 2, name: 'Track 2', artist: 'Artist 2', album: 'Album 2' }
    // Add more mock tracks
  ];

  return (
    <div className="SearchResults">
      <h2>Results</h2>
      <TrackList tracks={searchResults} />
    </div>
  );
}

export default SearchResults;
