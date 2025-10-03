import { useState } from 'react';
import './NASASearch.css';
import perplexityService from '../services/perplexityService';
import KnowledgeGraph from './KnowledgeGraph';

// Clean Perplexity AI responses
function cleanPerplexityResponse(text) {
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

export default function NASASearch() {
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState('comprehensive');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('search');
    const [gapAnalysis, setGapAnalysis] = useState(null);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setActiveTab('results');
        
        try {
            const searchResults = await perplexityService.searchNASAResources(query, {
                searchType: searchType
            });

            if (searchResults.success) {
                // Extract structured data for better visualization
                const structuredData = await perplexityService.extractStructuredData(searchResults);
                
                setResults({
                    ...searchResults,
                    structured: structuredData
                });
            } else {
                setResults(searchResults);
            }
        } catch (error) {
            console.error('Search error:', error);
            setResults({
                success: false,
                error: 'Search failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGapAnalysis = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setActiveTab('gaps');
        
        try {
            const analysis = await perplexityService.analyzeResearchGaps(query);
            setGapAnalysis(analysis);
        } catch (error) {
            console.error('Gap analysis error:', error);
            setGapAnalysis({
                success: false,
                error: 'Analysis failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="nasa-search-container">
            <div className="nasa-search-header">
                <h2 className="nasa-title">🚀 NASA Space Biology Knowledge Engine</h2>
                <p className="nasa-subtitle">
                    Search across 608+ publications from NASA's OSDR, NSLSL, and Task Book
                </p>
            </div>

            <div className="nasa-search-box">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about space biology research..."
                    className="nasa-search-input"
                    aria-label="NASA research search"
                />

                <div className="search-type-selector">
                    <label>
                        <input
                            type="radio"
                            value="comprehensive"
                            checked={searchType === 'comprehensive'}
                            onChange={(e) => setSearchType(e.target.value)}
                        />
                        <span>All Resources</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="publications"
                            checked={searchType === 'publications'}
                            onChange={(e) => setSearchType(e.target.value)}
                        />
                        <span>Publications</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="datasets"
                            checked={searchType === 'datasets'}
                            onChange={(e) => setSearchType(e.target.value)}
                        />
                        <span>Datasets</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="grants"
                            checked={searchType === 'grants'}
                            onChange={(e) => setSearchType(e.target.value)}
                        />
                        <span>Grants</span>
                    </label>
                </div>

                <div className="nasa-action-buttons">
                    <button 
                        onClick={handleSearch} 
                        className="nasa-search-btn"
                        disabled={loading || !query.trim()}
                    >
                        {loading && activeTab === 'results' ? '🔍 Searching...' : '🔍 Search NASA Resources'}
                    </button>
                    <button 
                        onClick={handleGapAnalysis} 
                        className="nasa-gap-btn"
                        disabled={loading || !query.trim()}
                    >
                        {loading && activeTab === 'gaps' ? '📊 Analyzing...' : '📊 Analyze Research Gaps'}
                    </button>
                </div>
            </div>

            {/* Results Display */}
            {results && activeTab === 'results' && (
                <div className="nasa-results">
                    {results.success ? (
                        <>
                            <div className="results-header">
                                <h3>Search Results for: "{results.query}"</h3>
                                <span className="search-type-badge">{results.searchType}</span>
                            </div>

                            <div className="results-content">
                                <div className="main-response">
                                    <h4>📋 Summary</h4>
                                    <div className="response-text">
                                        {cleanPerplexityResponse(results.response).split('\n').map((line, idx) => (
                                            <p key={idx}>{line}</p>
                                        ))}
                                    </div>
                                </div>

                                {results.citations && results.citations.length > 0 && (
                                    <div className="citations-section">
                                        <h4>🔗 Citations & Sources</h4>
                                        <ul className="citations-list">
                                            {results.citations.map((citation, idx) => (
                                                <li key={idx}>
                                                    <a href={citation} target="_blank" rel="noopener noreferrer">
                                                        {citation}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {results.structured && (
                                    <div className="structured-data">
                                        {results.structured.experiments && results.structured.experiments.length > 0 && (
                                            <div className="data-section">
                                                <h4>🧪 Relevant Experiments</h4>
                                                <div className="cards-grid">
                                                    {results.structured.experiments.map((exp, idx) => (
                                                        <div key={idx} className="data-card">
                                                            <h5>{exp.title}</h5>
                                                            <p>{exp.summary}</p>
                                                            {exp.link && (
                                                                <a href={exp.link} target="_blank" rel="noopener noreferrer">
                                                                    View Experiment →
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {results.structured.keyFindings && results.structured.keyFindings.length > 0 && (
                                            <div className="data-section">
                                                <h4>💡 Key Findings</h4>
                                                <ul className="findings-list">
                                                    {results.structured.keyFindings.map((finding, idx) => (
                                                        <li key={idx}>{finding}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {results.structured.researchGaps && results.structured.researchGaps.length > 0 && (
                                            <div className="data-section gaps-section">
                                                <h4>🎯 Research Gaps</h4>
                                                <ul className="gaps-list">
                                                    {results.structured.researchGaps.map((gap, idx) => (
                                                        <li key={idx}>{gap}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Knowledge Graph Visualization */}
                                {results.structured && (
                                    <KnowledgeGraph data={results} />
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="error-message">
                            <p>❌ {results.error || 'Search failed. Please check your API key and try again.'}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Gap Analysis Display */}
            {gapAnalysis && activeTab === 'gaps' && (
                <div className="nasa-results gap-analysis-results">
                    {gapAnalysis.success ? (
                        <>
                            <div className="results-header">
                                <h3>Research Gap Analysis: "{gapAnalysis.topic}"</h3>
                            </div>

                            <div className="results-content">
                                <div className="main-response">
                                    <div className="response-text">
                                        {cleanPerplexityResponse(gapAnalysis.analysis).split('\n').map((line, idx) => (
                                            <p key={idx}>{line}</p>
                                        ))}
                                    </div>
                                </div>

                                {gapAnalysis.citations && gapAnalysis.citations.length > 0 && (
                                    <div className="citations-section">
                                        <h4>🔗 Referenced Sources</h4>
                                        <ul className="citations-list">
                                            {gapAnalysis.citations.map((citation, idx) => (
                                                <li key={idx}>
                                                    <a href={citation} target="_blank" rel="noopener noreferrer">
                                                        {citation}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="error-message">
                            <p>❌ {gapAnalysis.error || 'Analysis failed. Please try again.'}</p>
                        </div>
                    )}
                </div>
            )}

            {/* NASA Resources Info */}
            <div className="nasa-resources-info">
                <h4>📚 Searching Across:</h4>
                <div className="resource-badges">
                    <div className="resource-badge">
                        <span className="badge-icon">🗄️</span>
                        <div>
                            <strong>OSDR</strong>
                            <small>Open Science Data Repository</small>
                        </div>
                    </div>
                    <div className="resource-badge">
                        <span className="badge-icon">📖</span>
                        <div>
                            <strong>NSLSL</strong>
                            <small>Space Life Sciences Library</small>
                        </div>
                    </div>
                    <div className="resource-badge">
                        <span className="badge-icon">💼</span>
                        <div>
                            <strong>Task Book</strong>
                            <small>Funded Research Projects</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
