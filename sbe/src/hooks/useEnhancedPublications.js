// src/hooks/useEnhancedPublications.js
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import perplexityService from "../services/perplexityService";

export default function useEnhancedPublications(searchTerm = "", searchBoth = true) {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enhancedQuery, setEnhancedQuery] = useState(null);
  const [searchPhase, setSearchPhase] = useState('idle'); // 'idle', 'enhancing', 'searching', 'complete'
  const [nasaResults, setNasaResults] = useState(null);

  useEffect(() => {
    async function fetchAndSearchData() {
      if (!searchTerm || searchTerm.trim().length === 0) {
        setPublications([]);
        setSearchPhase('idle');
        setEnhancedQuery(null);
        setNasaResults(null);
        return;
      }

      try {
        setLoading(true);
        
        // Phase 1: Enhance query with AI
        setSearchPhase('enhancing');
        const enhanced = await perplexityService.enhanceSearchQuery(searchTerm);
        setEnhancedQuery(enhanced);
        
        // Phase 2: Search Firestore database
        setSearchPhase('searching');
        const querySnapshot = await getDocs(collection(db, "publications"));
        let firestoreData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          source: 'firestore',
          ...doc.data()
        }));
        
        // Phase 3: Search NASA resources if enabled
        let nasaPublications = [];
        if (searchBoth) {
          setSearchPhase('searching-nasa');
          const nasaSearch = await perplexityService.searchNASAResources(searchTerm, {
            searchType: 'comprehensive'
          });
          
          if (nasaSearch.success) {
            setNasaResults(nasaSearch);
            
            // Clean up the NASA response by removing citation markers
            const cleanResponse = cleanPerplexityResponse(nasaSearch.response);
            
            // Create a direct NASA result from the search response
            // This ensures the NASA content is always shown
            nasaPublications.push({
              id: 'nasa-direct',
              Title: `NASA Research: ${searchTerm}`,
              Authors: 'NASA',
              Year: new Date().getFullYear().toString(),
              Link: nasaSearch.citations && nasaSearch.citations[0] ? nasaSearch.citations[0] : 'https://osdr.nasa.gov',
              Category: 'NASA OSDR/NSLSL/Task Book',
              Tags: ['NASA', 'Space Biology', 'Research'],
              Summary: cleanResponse.substring(0, 300) + '...',
              Abstract: cleanResponse,
              source: 'nasa',
              relevanceScore: 200, // Highest priority
              isNASADirect: true
            });
            
            // Extract structured data from NASA results
            const structured = await perplexityService.extractStructuredData(nasaSearch);
            
            if (structured && structured.publications) {
              const extractedPubs = structured.publications.map((pub, idx) => ({
                id: `nasa-${idx}`,
                Title: pub.title,
                Authors: pub.authors || 'Not available',
                Year: pub.year || 'N/A',
                Link: pub.link || 'https://osdr.nasa.gov',
                Category: 'NASA Research',
                Tags: structured.categories || [],
                Summary: pub.summary || nasaSearch.response.substring(0, 200) + '...',
                source: 'nasa',
                relevanceScore: 150 // High priority for NASA results
              }));
              nasaPublications.push(...extractedPubs);
            }
          }
        }
        
        // Combine Firestore and NASA results
        const allData = [...firestoreData, ...nasaPublications];
        
        // Enhanced search with scoring
        const searchResults = searchPublications(allData, enhanced, searchTerm);
        
        setPublications(searchResults);
        setSearchPhase('complete');
      } catch (error) {
        console.error('Search error:', error);
        setSearchPhase('error');
      } finally {
        setLoading(false);
      }
    }

    // Debounce the search
    const timeoutId = setTimeout(fetchAndSearchData, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, searchBoth]);

  return { 
    publications, 
    loading, 
    enhancedQuery, 
    searchPhase,
    nasaResults,
    getPhaseMessage: () => getPhaseMessage(searchPhase, publications.length)
  };
}

function searchPublications(publications, enhancedQuery, originalTerm) {
  const searchTerms = [
    originalTerm,
    ...enhancedQuery.keywords,
    ...enhancedQuery.scientificTerms,
    ...enhancedQuery.categories,
    ...enhancedQuery.tags
  ].filter(term => term && term.length > 1);

  return publications
    .map(pub => {
      const score = calculateRelevanceScore(pub, searchTerms, originalTerm);
      return {
        ...pub,
        relevanceScore: score.total,
        matchDetails: score.details
      };
    })
    .filter(pub => pub.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

function calculateRelevanceScore(publication, searchTerms, originalTerm) {
  let score = 0;
  const details = {
    titleMatches: [],
    categoryMatches: [],
    tagMatches: [],
    exactMatch: false
  };

  const title = (publication.Title || '').toLowerCase();
  const category = (publication.Category || '').toLowerCase();
  const tags = Array.isArray(publication.Tags) ? 
    publication.Tags.join(' ').toLowerCase() : 
    (publication.Tags || '').toLowerCase();

  // Check for exact phrase match in title (highest weight)
  if (title.includes(originalTerm.toLowerCase())) {
    score += 100;
    details.exactMatch = true;
  }

  // Search each term
  searchTerms.forEach(term => {
    if (!term || term.length < 2) return;
    
    const termLower = term.toLowerCase();
    
    // Title matches (high weight)
    if (title.includes(termLower)) {
      score += 50;
      details.titleMatches.push(term);
    }
    
    // Category matches (medium weight)
    if (category.includes(termLower)) {
      score += 30;
      details.categoryMatches.push(term);
    }
    
    // Tag matches (medium weight)
    if (tags.includes(termLower)) {
      score += 25;
      details.tagMatches.push(term);
    }
  });

  // Boost score if multiple fields match
  const fieldCount = [
    details.titleMatches.length > 0,
    details.categoryMatches.length > 0,
    details.tagMatches.length > 0
  ].filter(Boolean).length;
  
  if (fieldCount > 1) {
    score += fieldCount * 10;
  }

  // Convert score to relevance category
  const relevanceCategory = getRelevanceCategory(score);

  return {
    total: score,
    details,
    category: relevanceCategory
  };
}

function getRelevanceCategory(score) {
  if (score >= 100) {
    return {
      label: "Highly Relevant",
      class: "highly-relevant",
      icon: "🎯"
    };
  } else if (score >= 75) {
    return {
      label: "Very Relevant",
      class: "very-relevant",
      icon: "⭐"
    };
  } else if (score >= 50) {
    return {
      label: "Relevant",
      class: "relevant",
      icon: "✓"
    };
  } else if (score >= 25) {
    return {
      label: "Somewhat Relevant",
      class: "somewhat-relevant",
      icon: "~"
    };
  } else {
    return {
      label: "Slightly Relevant",
      class: "slightly-relevant",
      icon: "·"
    };
  }
}

/**
 * Clean Perplexity AI response by removing citation markers and special symbols
 */
function cleanPerplexityResponse(text) {
  if (!text) return '';
  
  return text
    // Remove citation markers like [1], [2], [3], etc.
    .replace(/\[\d+\]/g, '')
    // Remove multiple citation markers like [1][2][3]
    .replace(/(\[\d+\])+/g, '')
    // Remove citation ranges like [1-3]
    .replace(/\[\d+-\d+\]/g, '')
    // Clean up extra spaces left by removed citations
    .replace(/\s+/g, ' ')
    // Remove leading/trailing spaces
    .trim()
    // Fix spacing around punctuation
    .replace(/\s+([.,;:!?])/g, '$1')
    // Fix spacing after punctuation
    .replace(/([.,;:!?])([A-Z])/g, '$1 $2');
}

function getPhaseMessage(phase, resultCount) {
  switch (phase) {
    case 'enhancing':
      return 'Analyzing query with AI...';
    case 'searching':
      return 'Searching Firestore database...';
    case 'searching-nasa':
      return 'Searching NASA resources...';
    case 'complete':
      return `Found ${resultCount} relevant publications`;
    case 'error':
      return 'Search error occurred';
    default:
      return '';
  }
}
