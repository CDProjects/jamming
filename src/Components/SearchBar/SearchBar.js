import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');

  const handleTermChange = (event) => {
    setTerm(event.target.value);
  };

  const handleSearch = () => {
    onSearch(term);
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
