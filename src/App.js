import React, { useState } from "react";
import SearchBar from "./SearchBar/SearchBar";
import SearchResults from "./SearchResults/SearchResults";
import Playlist from "./Playlist/Playlist";
import "./App.css";

function App() {
  const [searchResults, setSearchResults] = useState([
    // Existing mock search results
  ]);
  const [playlistName, setPlaylistName] = useState("My Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([
    { id: 3, name: "Track Name 3", artist: "Artist 3", album: "Album 3" },
    { id: 4, name: "Track Name 4", artist: "Artist 4", album: "Album 4" },
    // Add more tracks as needed
  ]);

  const addTrackToPlaylist = (track) => {
    if (playlistTracks.find((savedTrack) => savedTrack.id === track.id)) {
      return; // Track already in playlist, do nothing
    }
    setPlaylistTracks([...playlistTracks, track]);
  };

  return (
    <div className="App">
      <SearchBar />
      <div className="App-playlist">
        <SearchResults
          searchResults={searchResults}
          onAdd={addTrackToPlaylist}
        />
        <Playlist
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          onNameChange={setPlaylistName}
        />
      </div>
    </div>
  );
}

export default App;
