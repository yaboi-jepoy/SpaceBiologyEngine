// for handling states (ata?)
import { useState } from "react";
import usePublications from "../hooks/usePublications";
import './searchbar.css';
// Simple magnifier icon SVG
const SearchIcon = () => (
    <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="7" stroke="#5f6368" strokeWidth="2" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#5f6368" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export default function SearchBar() {
    const [searchText, setSearchText] = useState("");
    const { publications, loading } = usePublications(searchText);

    // Only show results if user has typed something
    const term = searchText.trim().toLowerCase();
    const showResults = term.length > 0;

    return (
        <div className="search-container">
            <div style={{ position: "relative", width: "100%" }}>
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Enter query or keywords..."
                    className="search-input"
                    autoComplete="off"
                />
                {searchText && (
                    <button
                        className="search-clear-btn"
                        onClick={() => setSearchText("")}
                        aria-label="Clear search"
                        type="button"
                    >
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11" cy="11" r="11" fill="#f1f3f4" />
                            <path d="M7 7L15 15M15 7L7 15" stroke="#5f6368" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                )}
            </div>
            {/* Autocomplete results below search bar */}
            {showResults && (
                <div className="search-results">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <ul>
                            {publications.length === 0 ? (
                                <li>No results found.</li>
                            ) : (
                                publications.map((pub, idx) => (
                                    <li key={idx}>
                                        <SearchIcon />
                                        <a
                                            href={pub.Link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {pub.Title}
                                        </a>
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}