import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');

  const handleTermChange = (event) => {
    setTerm(event.target.value);
  };

  const handleSearch = async () => {
    try {
      // Call the onSearch prop function passed down from the parent component
      // This function is responsible for updating the search results in the state of the App component
      await onSearch(term);
    } catch (error) {
      console.error("Error during Spotify search:", error);
      // If I have a method to update an error message in the App's state, you would call it here
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
