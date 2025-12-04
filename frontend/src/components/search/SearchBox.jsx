import React from 'react';
import './SearchBox.css';

const SearchBox = ({ searchTerm, setSearchTerm, tagTerm, setTagTerm }) => {
  return (
    <div className="search-box-container">
      <div className="search-inputs-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search events by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <input
          type="text"
          className="search-input tag-search-input"
          placeholder="Filter by #tag..."
          value={tagTerm}
          onChange={(e) => setTagTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBox;