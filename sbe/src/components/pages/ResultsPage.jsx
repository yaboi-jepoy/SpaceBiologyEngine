import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/pages/ResultsPage.css';
import SearchEntry from '../searchEntry';
import SearchBar from '../searchBar';
import AiBox from '../aiBox';
import PublicationModal from '../PublicationModal';
import useEnhancedSearch from '../../hooks/useEnhancedSearch';
import usePublications from '../../hooks/usePublications';
import perplexityService from '../../services/perplexityService';
import blackLogo from '../../assets/app_logos/bioseeker_black.png';
import whiteLogo from '../../assets/app_logos/bioseeker_white.png';
import SideBar from '../SideBar';

const ResultsPage = ({ theme, setTheme }) => {
  const location = useLocation();
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [publicationAnalysis, setPublicationAnalysis] = useState(null);
  const [analyzingPublication, setAnalyzingPublication] = useState(false);
  
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

  // Handle publication click
  const handlePublicationClick = async (publication) => {
    setSelectedPublication(publication);
    setPublicationAnalysis(null);
    setAnalyzingPublication(true);

    const analysis = await perplexityService.analyzePublication(publication);
    setPublicationAnalysis(analysis);
    setAnalyzingPublication(false);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedPublication(null);
    setPublicationAnalysis(null);
    setAnalyzingPublication(false);
  };

  return (
    <div className="results-container">
     <SideBar theme={theme} setTheme={setTheme} />
      <div className="results-header">
        <img
          src={theme === 'light' ? blackLogo : whiteLogo}
          className='header-logo'
          alt='BioSeeker Logo'
        />
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
            title={aiSummary.isQuestion ? "AI Answer" : "AI Overview"}
            description={aiSummary.summary}
            tags={aiSummary.isQuestion ? "AI-Generated Answer" : "AI-Generated Overview"}
            results={results}
            loading={aiSummary.loading}
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
          <div 
            key={entry.id || index} 
            id={entry.scrollId || `result-${index}`} 
            className="scroll-target results-entry-box"
            onClick={() => handlePublicationClick(entry)}
            style={{ cursor: 'pointer' }}
          >
            <SearchEntry 
              title={entry.title}
              description={entry.description}
              tags={entry.tags}
              link={entry.link}
              source={entry.source}
              relevanceScore={entry.relevanceScore || entry.adjustedScore}
              className="results-entry"
            />
          </div>
        ))}
      </div>

      {/* Publication Analysis Modal */}
      {selectedPublication && (
        <PublicationModal
          publication={selectedPublication}
          analysis={publicationAnalysis}
          loading={analyzingPublication}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default ResultsPage;