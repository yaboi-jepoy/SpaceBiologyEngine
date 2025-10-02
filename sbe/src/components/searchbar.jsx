import { useState } from "react";
import './searchbar.css'
import SearchButton from '../assets/main_page_icons/search.svg';
import AdvancedButton from '../assets/main_page_icons/advanced.svg';
import useEnhancedPublications from "../hooks/useEnhancedPublications";

export default function SearchBar() {
    const [searchText, setSearchText] = useState('');
    const { 
        publications, 
        loading, 
        enhancedQuery, 
        searchPhase, 
        getPhaseMessage 
    } = useEnhancedPublications(searchText);
    
    // only show results if user has typed something
    const term = searchText.trim().toLowerCase();
    const showResults = term.length > 0;

    const handleSearch = () => {
        alert(`You searched for: ${searchText}`);
    }

    // call function above when Enter is pressed
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            // handleSearch();
        }
    }

    // what this component will display
    return (
        <div className='search-container'>
            <div className='search-box'>
                {/* Keyword Search Input*/}
                    <input type="text" 
                    value={searchText} 
                    onChange={(e) => setSearchText(e.target.value)} 
                    onKeyPress={handleKeyPress}
                    placeholder="Enter query or keywords..."
                    className="search-input"
                />

                {/* Enhanced Search Results */}
                {showResults && (
                    <div className="search-results-dropdown">
                        {loading ? (
                            <div className="search-loading">
                                <div className="loading-spinner"></div>
                                <div className="search-phase">{getPhaseMessage()}</div>
                                {enhancedQuery && enhancedQuery.keywords && (
                                    <div className="enhanced-keywords">
                                        <small>Searching: {enhancedQuery.keywords.slice(0, 5).join(', ')}</small>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                {enhancedQuery && !enhancedQuery.fallback && (
                                    <div className="ai-enhancement-info">
                                        <small>🤖 AI-enhanced search active</small>
                                    </div>
                                )}
                                <ul className="search-results-list">
                                    {publications.length === 0 ? (
                                        <li className="no-result">No results found</li>
                                    ) : (
                                        publications.map((pub, idx) => (
                                            <a
                                                key={pub.id || idx}
                                                href={pub.Link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="search-result-link"
                                            >
                                                <li className="enhanced-search-result">
                                                    <div className="result-header">
                                                        <img src={SearchButton} className="result-icon" />
                                                        <span className="result-content">
                                                            <div className="result-title">{pub.Title}</div>
                                                            <div className="result-meta">
                                                                {pub.Category && (
                                                                    <span className="result-category">{pub.Category}</span>
                                                                )}
                                                                {pub.matchDetails && pub.matchDetails.category && (
                                                                    <span className={`relevance-badge ${pub.matchDetails.category.class}`}>
                                                                        {pub.matchDetails.category.icon} {pub.matchDetails.category.label}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {pub.Tags && (
                                                                <div className="result-tags">
                                                                    {Array.isArray(pub.Tags) ? 
                                                                        pub.Tags.slice(0, 3).map(tag => (
                                                                            <span key={tag} className="tag">{tag}</span>
                                                                        )) :
                                                                        <span className="tag">{pub.Tags}</span>
                                                                    }
                                                                </div>
                                                            )}
                                                            {pub.matchDetails && pub.matchDetails.exactMatch && (
                                                                <div className="exact-match-indicator">
                                                                    ✨ Exact match found
                                                                </div>
                                                            )}
                                                        </span>
                                                    </div>
                                                </li>
                                            </a>
                                        ))
                                    )}
                                </ul>
                            </>
                        )}
                    </div>
                )}

                {/* Keyword Search Button*/}
                {/* <img onClick={handleSearch} src={SearchButton} className='search-button' alt='Search' /> */}

                {/* Advanced Search Button*/}
                {/* <img src={AdvancedButton} className='advanced-button' /> */}
            </div>
        </div>
    )
}