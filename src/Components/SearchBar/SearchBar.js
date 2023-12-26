import React, { useState } from 'react';
import Spotify from "./Spotify"; // Path to Spotify.js
import './SearchBar.css';

function SearchBar() {
  const [term, setTerm] = useState('');

  const handleTermChange = (event) => {
    setTerm(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const results = await Spotify.search(term);
      // Assuming you have a method to update the search results in your state
      // updateSearchResults(results);
    } catch (error) {
      console.error("Error during Spotify search:", error);
      // Handle the error, possibly update state with an error message
    }
  };

  return (
    <div className="SearchBar">
      <input 
        placeholder="Enter A Song, Album, or Artist" 
        onChange={handleTermChange}
        value={term}
      />
      <button className="SearchButton" onClick={handleSearch}>SEARCH</button>
    </div>
  );
}

export default SearchBar;
