import { useState } from "react";
import './searchbar.css'
import SearchButton from '../assets/main_page_icons/search.svg';
import ClearIcon from '../assets/main_page_icons/clear.svg';
import useEnhancedPublications from "../hooks/useEnhancedPublications";

// Clean Perplexity AI responses
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\[\d+\]/g, '')
    .replace(/(\[\d+\])+/g, '')
    .replace(/\[\d+-\d+\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/([.,;:!?])([A-Z])/g, '$1 $2');
}

export default function SearchBar() {
    const [searchText, setSearchText] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [previewItem, setPreviewItem] = useState(null);
    const [fullContentItem, setFullContentItem] = useState(null);
    const [searchNASA, setSearchNASA] = useState(true); // Toggle NASA search
    const { 
        publications, 
        loading, 
        enhancedQuery, 
        searchPhase,
        nasaResults,
        getPhaseMessage 
    } = useEnhancedPublications(searchText, searchNASA);
    
    // only show results if user has typed something
    const term = searchText.trim().toLowerCase();
    const showResults = term.length > 0;

    const handleSearch = () => {
        alert(`You searched for: ${searchText}`);
    }

    // Handle keyboard navigation
    const handleKeyDown = (event) => {
        if (!showResults || publications.length === 0) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setSelectedIndex(prev => 
                    prev < publications.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                event.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                event.preventDefault();
                if (selectedIndex >= 0 && publications[selectedIndex]) {
                    window.open(publications[selectedIndex].Link, '_blank');
                }
                break;
            case 'Escape':
                setSearchText('');
                setSelectedIndex(-1);
                break;
        }
    };

    const clearSearch = () => {
        setSearchText('');
        setSelectedIndex(-1);
        setPreviewItem(null);
        setFullContentItem(null);
    };

    const handleResultClick = (pub, idx) => {
        // First click: Show preview
        if (!previewItem || previewItem.id !== pub.id) {
            setPreviewItem(pub);
            setFullContentItem(null);
        } 
        // Second click: Show full content
        else if (previewItem && previewItem.id === pub.id) {
            setFullContentItem(pub);
        }
    };

    const closePreview = () => {
        setPreviewItem(null);
    };

    const closeFullContent = () => {
        setFullContentItem(null);
    };

    // what this component will display
    return (
        <div className='search-container'>
            <div className='search-box'>
                {/* Keyword Search Input*/}
                <input 
                    type="text" 
                    value={searchText} 
                    onChange={(e) => setSearchText(e.target.value)} 
                    onKeyDown={handleKeyDown}
                    placeholder="Enter query or keywords..."
                    className="search-input"
                    aria-label="Search for space biology publications"
                    aria-describedby="search-instructions"
                    aria-expanded={showResults}
                    aria-controls="search-results"
                    aria-activedescendant={selectedIndex >= 0 ? `result-${selectedIndex}` : undefined}
                    autoComplete="off"
                    role="combobox"
                />
                {searchText && (
                    <img
                        src={ClearIcon}
                        onClick={clearSearch}
                        className="search-clear-btn"
                        aria-label="Clear search"
                    >
                    </img>
                )}
                {/* <span className='search-instructions'>
                    Use arrow keys to navigate results, enter to open, and escape to clear.
                </span> */}

                {/* Enhanced Search Results */}
                {showResults && (
                    <div 
                        className="search-results-dropdown"
                        id="search-results"
                        role="listbox"
                        aria-label="Search results"
                    >
                        {loading ? (
                            <div className="search-loading" role="status" aria-live="polite">
                                <div className="loading-spinner" aria-hidden="true"></div>
                                <div className="search-phase" aria-label={getPhaseMessage()}>{getPhaseMessage()}</div>
                                {enhancedQuery && enhancedQuery.keywords && (
                                    <div className="search-phase">
                                        <small>Searching: {enhancedQuery.keywords.slice(0, 5).join(', ')}</small>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <ul className="search-results-list" role="presentation">
                                    {publications.length === 0 ? (
                                        <li className="no-result" role="option">No results found</li>
                                    ) : (
                                        publications.map((pub, idx) => (
                                            <span
                                                key={pub.id || idx}
                                                onClick={() => handleResultClick(pub, idx)}
                                                className={`search-result-link ${selectedIndex === idx ? 'selected' : ''} ${previewItem?.id === pub.id ? 'active-preview' : ''} ${pub.isNASADirect ? 'nasa-direct-result' : ''}`}
                                                id={`result-${idx}`}
                                                role="option"
                                                aria-selected={selectedIndex === idx}
                                            >
                                                <li className="enhanced-search-result">
                                                    <div className="result-header">
                                                        <img src={SearchButton} className="result-icon" />
                                                        <div className="result-content">
                                                            <div className="result-title">{pub.Title}</div>
                                                            <div className="result-meta">
                                                                {pub.source && (
                                                                    <span className={`source-badge ${pub.source}`}>
                                                                        {pub.source === 'nasa' ? '🚀 NASA' : '📚 Database'}
                                                                    </span>
                                                                )}
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
                                                        </div>
                                                    </div>
                                                </li>
                                            </span>
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
                {/* <img src={AdvancedButton} href='' className='advanced-button' /> */}
            </div>

            {/* Preview Box - First Click */}
            {previewItem && !fullContentItem && (
                <div className="preview-modal-overlay" onClick={closePreview}>
                    <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closePreview}>✕</button>
                        <div className="preview-header">
                            <h3>📝 Preview</h3>
                            <span className="preview-hint">Click result again to view full content</span>
                        </div>
                        <div className="preview-content">
                            <h2 className="preview-title">{previewItem.Title}</h2>
                            
                            <div className="preview-metadata">
                                <div className="metadata-item">
                                    <span className="metadata-label">👤 Author(s):</span>
                                    <span className="metadata-value">{previewItem.Authors || 'Not available'}</span>
                                </div>
                                <div className="metadata-item">
                                    <span className="metadata-label">📅 Date:</span>
                                    <span className="metadata-value">{previewItem.Date || previewItem.Year || 'Not available'}</span>
                                </div>
                                <div className="metadata-item">
                                    <span className="metadata-label">🔗 Source:</span>
                                    <span className="metadata-value">{previewItem.Source || previewItem.Category || 'Not available'}</span>
                                </div>
                            </div>

                            <div className="preview-summary">
                                <h4>Summary</h4>
                                <p>{cleanText(previewItem.Summary || previewItem.Abstract || 'This publication covers research in ' + (previewItem.Category || 'space biology') + '. Click to view full content for detailed information.')}</p>
                            </div>

                            {previewItem.Tags && (
                                <div className="preview-tags">
                                    <strong>Tags:</strong>
                                    {Array.isArray(previewItem.Tags) ? 
                                        previewItem.Tags.map(tag => (
                                            <span key={tag} className="preview-tag">{tag}</span>
                                        )) :
                                        <span className="preview-tag">{previewItem.Tags}</span>
                                    }
                                </div>
                            )}

                            <div className="preview-actions">
                                <button 
                                    className="view-full-btn" 
                                    onClick={() => setFullContentItem(previewItem)}
                                >
                                    📄 View Full Content
                                </button>
                                {previewItem.Link && (
                                    <a 
                                        href={previewItem.Link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="external-link-btn"
                                    >
                                        🔗 Open External Link
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Full Content Modal - Second Click */}
            {fullContentItem && (
                <div className="fullcontent-modal-overlay" onClick={closeFullContent}>
                    <div className="fullcontent-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeFullContent}>✕</button>
                        <div className="fullcontent-header">
                            <button className="back-to-preview-btn" onClick={() => setFullContentItem(null)}>
                                ← Back to Preview
                            </button>
                            <h2>{fullContentItem.Title}</h2>
                        </div>
                        <div className="fullcontent-body">
                            {fullContentItem.Link ? (
                                <iframe 
                                    src={fullContentItem.Link}
                                    className="content-iframe"
                                    title={fullContentItem.Title}
                                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                />
                            ) : (
                                <div className="no-content-message">
                                    <p>📄 Full content not available for embedding.</p>
                                    <p>This publication may require external access.</p>
                                    {fullContentItem.Abstract && (
                                        <div className="abstract-section">
                                            <h3>Abstract</h3>
                                            <p>{cleanText(fullContentItem.Abstract)}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}