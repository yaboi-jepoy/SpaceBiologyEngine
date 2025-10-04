import React from "react";
import '../styles/searchBar.css';

export default function SearchBar({query, placeholder, ariaLabel}) {
    return (
        // the input side
        <div className="searchbar-container">
            <input 
                type="text"
                placeholder={placeholder}
                className={"searchbar-input"}
                aria-label={ariaLabel}
            />
            {/* the button */}
            <button className="searchbar-button">GO</button>
        </div>
    )
}