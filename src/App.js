import React, { useState, useEffect } from "react";
import Spotify from "./Spotify"; // Path to Spotify.js
import SearchBar from "./Components/SearchBar/SearchBar";
import SearchResults from "./Components/SearchResults/SearchResults";
import Playlist from "./Components/Playlist/Playlist";
import "./App.css";

function App() {
  useEffect(() => {
    Spotify.getAccessToken();
  }, []);

  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("My Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const addTrackToPlaylist = (track) => {
    if (playlistTracks.find((savedTrack) => savedTrack.id === track.id)) {
      return;
    }
    setPlaylistTracks([...playlistTracks, track]);
  };

  const removeTrackFromPlaylist = (track) => {
    setPlaylistTracks(playlistTracks.filter((savedTrack) => savedTrack.id !== track.id));
  };

  const updatePlaylistName = (newName) => {
    setPlaylistName(newName);
  };

  const savePlaylist = async () => {
    const trackURIs = playlistTracks.map((track) => track.uri);
    try {
      await Spotify.savePlaylist(playlistName, trackURIs);
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
    } catch (error) {
      console.error("Error during playlist save:", error);
      // Handle the error, possibly update state with an error message
    }
  };

  const search = async (term) => {
    if (!term) {
      setErrorMessage("Please enter a search term.");
      return;
    }

    try {
      const results = await Spotify.search(term);
      setSearchResults(results);
      setErrorMessage(""); // Clear error message on successful search
    } catch (error) {
      console.error("Error during Spotify search:", error);
      setSearchResults([]); // Reset search results in case of error
      setErrorMessage("Failed to fetch search results. Please try again."); // Set an error message to display to the user
    }
  };

  return (
    <div className="App">
      <SearchBar onSearch={search} />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="App-playlist">
        <SearchResults searchResults={searchResults} onAdd={addTrackToPlaylist} />
        <Playlist playlistName={playlistName} playlistTracks={playlistTracks} onNameChange={updatePlaylistName} onRemove={removeTrackFromPlaylist} onSave={savePlaylist} />
      </div>
    </div>
  );
}

export default App;
