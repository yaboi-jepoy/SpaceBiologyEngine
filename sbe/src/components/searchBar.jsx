import React from "react";
import '../styles/searchBar.css';

export default function SearchBar({
    query, 
    placeholder, 
    ariaLabel,
    onQueryChange,
    onSearch,
    loading = false
}) {

    // upon pressing enter key
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch && query?.trim()) {
            onSearch(query);
        }
    };

    // input change
    const handleChange = (e) => {
        if (onQueryChange) {
            onQueryChange(e.target.value);
        }
    };

    // button click
    const handleButtonClick = (e) => {
        e.preventDefault();
        if (onSearch && query?.trim()) {
            onSearch(query);
        }
    };

    return (
        // the input side
        <form onSubmit={handleSubmit} className="searchbar-container">
            <input 
                type="text"
                value={query || ''}
                onChange={handleChange}
                placeholder={placeholder}
                className={"searchbar-input"}
                aria-label={ariaLabel}
                disabled={loading}
            />
            {/* the button */}
            <button 
            type="submit"
            className="searchbar-button"
            onClick={handleButtonClick}
            disabled={loading || !query?.trim()}
            >
                {loading ? 'Searching...' : 'GO'}
            </button>
        </form>
    )
}