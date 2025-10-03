import React from 'react';
import './SearchBox.css';

const SearchBox = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-box-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search events by keyword..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBox;