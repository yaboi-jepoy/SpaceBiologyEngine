import React from "react";
import '../styles/searchBar.css';

export default function SearchBar({query, className, placeholder, ariaLabel}) {
    return (
        <input 
            type="text"
            placeholder={placeholder}
            className={className}
            aria-label={ariaLabel}
        />
    )
}