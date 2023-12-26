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

  const [searchResults, setSearchResults] = useState([]); // Start with an empty array

  const [playlistName, setPlaylistName] = useState("My Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([
    {
      id: 1,
      name: "Track 1",
      artist: "Artist 1",
      album: "Album 1",
      uri: "spotify:track:5Er1BdhfwUWxWFO8pxAYwD",
    },
    {
      id: 2,
      name: "Track 2",
      artist: "Artist 2",
      album: "Album 2",
      uri: "spotify:track:1tqArbKc1vM3R0BgeZ6055",
    },
    {
      id: 3,
      name: "Track 3",
      artist: "Artist 3",
      album: "Album 3",
      uri: "spotify:track:5RrGnZMEmSscpbcEftbt70",
    },
    {
      id: 4,
      name: "Track 4",
      artist: "Artist 4",
      album: "Album 4",
      uri: "spotify:track:6lJJcUjhsp0TJRuzUIPOYO",
    },
  ]);

  const [errorMessage, setErrorMessage] = useState(""); // State to manage error messages

  const addTrackToPlaylist = (track) => {
    if (playlistTracks.find((savedTrack) => savedTrack.id === track.id)) {
      return;
    }
    setPlaylistTracks([...playlistTracks, track]);
  };

  const removeTrackFromPlaylist = (track) => {
    setPlaylistTracks(
      playlistTracks.filter((savedTrack) => savedTrack.id !== track.id)
    );
  };

  const updatePlaylistName = (newName) => {
    setPlaylistName(newName);
  };

  const savePlaylist = () => {
    const trackURIs = playlistTracks.map((track) => track.uri);
    console.log("Saving playlist to Spotify with URIs:", trackURIs);
    // Here will interact with the Spotify API

    // Reset the playlist after saving
    setPlaylistName("New Playlist");
    setPlaylistTracks([]);
  };

  const search = (term) => {
    if (!term) {
      setErrorMessage("Please enter a search term.");
      return;
    }

    Spotify.search(term)
      .then((searchResults) => {
        setSearchResults(searchResults);
        setErrorMessage(""); // Clear error message on successful search
      })
      .catch((error) => {
        console.error("Error during Spotify search:", error);
        setSearchResults([]); // Reset search results in case of error
        setErrorMessage("Failed to fetch search results."); // Set error message
      });
  };

  return (
    <div className="App">
      <SearchBar onSearch={search} />
      {errorMessage && <div className="error-message">{errorMessage}</div>}{" "}
      {/* Display error message */}
      <div className="App-playlist">
        <SearchResults
          searchResults={searchResults}
          onAdd={addTrackToPlaylist}
        />
        <Playlist
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          onNameChange={updatePlaylistName}
          onRemove={removeTrackFromPlaylist}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
}

export default App;
