import { useMemo } from 'react';
import useEnhancedPublications from "../hooks/useEnhancedPublications";
import '../styles/searchbar.css';

export default function SearchResults({ query }) {
  const { publications, loading } = useEnhancedPublications(query, true);

  const hasQuery = (query || '').trim().length > 0;
  const items = publications || [];

  return (
    <div className='container'>
      <h1 className='title-1'>Search results for: {query || '...'}</h1>
      {!hasQuery && (
        <p style={{textAlign: 'center', color: '#666', marginTop: '20px'}}>
          Type a query on the home page to search publications.
        </p>
      )}
      {hasQuery && (
        <div className="search-results-page">
          {loading && (
            <div className="search-loading" role="status" aria-live="polite">
              <div className="loading-spinner" aria-hidden="true"></div>
              <div className="search-phase">Loading results...</div>
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="no-result" role="status">No results found</div>
          )}

          {!loading && items.length > 0 && (
            <ul className="search-results-list" role="list">
              {items.map((pub, idx) => (
                <li key={pub.id || idx} className="enhanced-search-result" role="listitem">
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
                    </div>
                    {pub.Summary && (
                      <div className="result-summary">
                        {String(pub.Summary).slice(0, 240)}{String(pub.Summary).length > 240 ? '…' : ''}
                      </div>
                    )}
                    {pub.Link && (
                      <div style={{marginTop: '8px'}}>
                        <a href={pub.Link} target="_blank" rel="noopener noreferrer">Open</a>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}


