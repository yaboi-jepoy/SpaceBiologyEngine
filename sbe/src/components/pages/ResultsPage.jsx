import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/pages/ResultsPage.css';
import SearchEntry from '../searchEntry';
import SearchBar from '../searchBar';
import AiBox from '../aiBox';
import useEnhancedSearch from '../../hooks/useEnhancedSearch';
import usePublications from '../../hooks/usePublications';

export default function ResultsPage() {
  const location = useLocation();
  const [highlightedId, setHighlightedId] = useState(null);
  
  // load initial query from navigation
  const initialQuery = location.state?.query || '';
  
  // get publications
  const { publications } = usePublications();
  
  // Use search hook
  const { 
    query, 
    setQuery, 
    results,
    loading,
    error,
    aiSummary,
    searchStats,
    performSearch 
  } = useEnhancedSearch(publications);

  // Perform search on mount
  React.useEffect(() => {
    if (initialQuery && publications.length > 0) {
      setQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery, publications.length]);

  // Handle new search
  const handleSearch = async (searchQuery) => {
    await performSearch(searchQuery);
  };

  // Add this function to handle reference clicks
  const handleReferenceClick = (refNumber) => {
    const targetId = `pub-${refNumber}`;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedId(targetId);
      setTimeout(() => setHighlightedId(null), 3000);
    }
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <SearchBar 
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          placeholder="Search the NASA Biology Database..."
          ariaLabel="Search space biology publications"
          loading={loading}
        />
        
        {query && (
          <div className="results-info">
            <p className='results-header-text'>
              {loading ? 'Searching...' : `Search results for "${query}"`}
            </p>
            {searchStats && (
              <p className='results-header-subtext'>
                {searchStats.resultCount} results • {searchStats.searchTime}ms
                {searchStats.cached && ' (cached)'}
                {searchStats.hasAI && ' • AI Enhanced'}
                {!searchStats.hasExternal && searchStats.localCount > 0 && ' • Local Database Only'}
              </p>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <div className="results-error">
          <p>❌ {error}</p>
        </div>
      )}

      <div className="results-list">
        {aiSummary && (
          <AiBox 
            title="AI Summary"
            description={aiSummary.summary}
            tags="AI-Generated Summary"
            onReferenceClick={handleReferenceClick} 
          />
        )}

        {loading && (
          <div className="results-loading">
            <p>🔍 Searching...</p>
          </div>
        )}

        {!loading && results.length === 0 && query && (
          <div className="results-empty">
            <p>No results found for "{query}"</p>
          </div>
        )}

        {results.map((entry, index) => (
          <SearchEntry
            key={entry.id || index}
            id={`pub-${index + 1}`}
            highlighted={highlightedId === `pub-${index + 1}`}
            title={entry.title}
            description={entry.description}
            tags={entry.tags}
            link={entry.link}
            source={entry.source}
            className="results-entry"
          />
        ))}
      </div>
    </div>
  );
}