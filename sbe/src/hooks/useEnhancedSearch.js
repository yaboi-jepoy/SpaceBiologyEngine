// src/hooks/useEnhancedSearch.js
import { useState, useCallback, useEffect } from 'react';
import perplexityService from '../services/perplexityService';
import contentSearchService from '../services/contentSearchService';

/**
 * Enhanced Search Hook
 * Combines local Firestore search + external NASA sites search
 */
export function useEnhancedSearch(publications = []) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [searchStats, setSearchStats] = useState(null);

  /**
   * Main search function
   */
  const performSearch = useCallback(async (searchQuery = query) => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);
    setAiSummary(null);

    const startTime = Date.now();

    // Check if query is a question
    const trimmedQuery = searchQuery.trim().toLowerCase();
    const isQuestion = /^(what|why|how|when|where|who|which|can|does|do|is|are|will|would|could|should)\b/i.test(trimmedQuery) 
                      || trimmedQuery.endsWith('?')
                      || /\b(what|why|how|when|where|who|which)\b/.test(trimmedQuery);
    
    // Show AI loading box IMMEDIATELY for all searches
    console.log(isQuestion ? 'Question detected, showing AI answer loading...' : 'Topic search, showing AI overview loading...');
    setAiSummary({ success: true, summary: 'loading', loading: true, isQuestion });

    try {
      // Check cache first
      const cached = contentSearchService.getCached(searchQuery);
      if (cached) {
        console.log('Using cached results');
        setResults(cached.results);
        setAiSummary(cached.aiSummary);
        setSearchStats({ ...cached.stats, cached: true });
        setLoading(false);
        return;
      }

      // STEP 1: Search local Firestore database
      console.log('🔍 Searching local database...');
      const localResults = contentSearchService.searchPublications(publications, searchQuery);
      const formattedLocal = contentSearchService.formatResults(localResults);

      // Show local results immediately
      setResults(formattedLocal);

      // STEP 2: Search external NASA sites (optional - may have CORS issues)
      console.log('🌐 Searching external NASA sites...');
      let externalResults = [];
      let hasExternalSearch = false;
      
      try {
        const externalSearch = await perplexityService.searchExternalNASA(searchQuery);
        console.log('🔍 External search response:', externalSearch);
        
        if (externalSearch.success && externalSearch.results.length > 0) {
          externalResults = externalSearch.results;
          hasExternalSearch = true;
          console.log('✅ External search successful:', externalResults.length, 'results');
          console.log('📋 Sample external result:', externalResults[0]);
          console.log('🔍 All external results:', externalResults);
        } else {
          console.log('ℹ️ No external results found. Reason:', externalSearch.error || 'No results returned');
          console.log('🔍 Full external search response:', externalSearch);
        }
      } catch (extErr) {
        console.warn('⚠️ External search failed (CORS or API issue), using local only:', extErr.message);
        console.log('🔧 Suggestion: Check API key and network connectivity');
        // Continue with local results only
      }

      // STEP 3: Combine results
      console.log('🔄 Before combining - Local:', formattedLocal.length, 'External:', externalResults.length);
      const combinedResults = contentSearchService.combineResults(formattedLocal, externalResults);
      
      // Add unique IDs for scroll-to functionality
      const resultsWithIds = combinedResults.map((result, index) => ({
        ...result,
        id: `result-${index}`,
        scrollId: `result-${index}`
      }));
      
      console.log('✅ Combined results:', resultsWithIds.length, 'total');
      console.log('📋 Sample combined result:', resultsWithIds[0]);
      console.log('🔍 External results in final list:', resultsWithIds.filter(r => r.source?.includes('External') || r.category?.includes('External')).length);
      
      // Update UI with combined results
      setResults(resultsWithIds);

      // STEP 4: Generate AI content (answer for questions, overview for topics)
      let hasAISummary = false;
      let aiSummary = null;
      
      console.log(isQuestion ? 'Generating AI answer for question...' : 'Generating AI overview...');
      
      try {
        aiSummary = await perplexityService.generateSummary(combinedResults, searchQuery, isQuestion);
        if (aiSummary?.success) {
          setAiSummary({ ...aiSummary, isQuestion });
          hasAISummary = true;
          console.log(isQuestion ? 'AI answer generated successfully' : 'AI overview generated successfully');
        } else {
          console.log('AI content not available');
          setAiSummary(null);
        }
      } catch (summaryErr) {
        console.warn('AI content failed:', summaryErr.message);
        setAiSummary(null);
      }

      // Cache everything
      const cacheData = {
        results: combinedResults,
        aiSummary: hasAISummary ? aiSummary : null,
        stats: {
          resultCount: combinedResults.length,
          localCount: formattedLocal.length,
          externalCount: externalResults.length,
          searchTime: Date.now() - startTime,
          hasAI: hasAISummary,
          hasExternal: hasExternalSearch
        }
      };
      contentSearchService.setCache(searchQuery, cacheData);
      setSearchStats(cacheData.stats);

    } catch (err) {
      console.error('❌ Search error:', err);
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [query, publications]);

  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setAiSummary(null);
    setSearchStats(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => perplexityService.cancelOngoing();
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    aiSummary,
    searchStats,
    performSearch,
    clearSearch
  };
}

export default useEnhancedSearch;