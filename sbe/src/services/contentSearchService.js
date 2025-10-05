// src/services/contentSearchService.js
/**
 * Content Search Service
 * Searches your local Firestore database
 * Works with the publications array from usePublications hook
 */

export class ContentSearchService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    
    // Space biology query expansion dictionary
    this.queryExpansions = {
      'ISS': 'International Space Station',
      'EVA': 'extravehicular activity spacewalk',
      'NASA': 'National Aeronautics Space Administration',
      'microgravity': 'microgravity zero gravity weightlessness',
      'astronaut': 'astronaut crew member space traveler',
      'bone loss': 'bone density osteoporosis skeletal',
      'muscle': 'muscle atrophy muscular skeletal',
      'plant': 'plant biology botany vegetation',
      'cell': 'cell biology cellular molecular',
      'experiment': 'experiment investigation study research',
      'radiation': 'radiation cosmic rays space radiation',
      'psychology': 'psychology mental health behavioral'
    };
  }

  /**
   * Search through publications array (from Firestore)
   */
  searchPublications(publications, query, filters = {}) {
    if (!query || !publications || publications.length === 0) {
      return [];
    }

    // Expand common space biology abbreviations and synonyms
    const expandedQuery = this.expandQuery(query);
    const lowerQuery = expandedQuery.toLowerCase();
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2);

    // Score and filter with minimum relevance threshold
    const scoredResults = publications
      .map(pub => {
        const score = this.calculateRelevanceScore(pub, queryWords, lowerQuery);
        return { ...pub, relevanceScore: score };
      })
      .filter(pub => {
        // Dynamic threshold based on query complexity and result quality
        let minScore;
        if (queryWords.length === 1) {
          minScore = 40; // Single word needs strong match
        } else if (queryWords.length === 2) {
          minScore = 25; // Two words, moderate threshold
        } else {
          minScore = 15; // Multiple words, lower threshold for complex queries
        }
        
        // Lower threshold if we don't have many results
        const totalResults = publications.length;
        if (totalResults < 10) {
          minScore = Math.max(5, minScore * 0.5);
        }
        
        return pub.relevanceScore >= minScore;
      });

    // Sort by relevance
    return scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Calculate relevance score with space biology intelligence
   * Searches: Title, Category, Tags, Impact, Link
   */
  calculateRelevanceScore(publication, queryWords, fullQuery) {
    let score = 0;

    const getField = (field) => {
      const value = publication[field];
      return value ? String(value).toLowerCase() : '';
    };

    // Get fields from Firestore (case-insensitive)
    const title = getField('Title') || getField('title');
    const link = getField('Link') || getField('link');
    const category = getField('Category') || getField('category');
    const tags = getField('Tags') || getField('tags');
    const impact = getField('Impact') || getField('impact');

    // Space biology priority keywords (higher scoring)
    const spaceBiologyTerms = [
      'microgravity', 'space', 'ISS', 'astronaut', 'zero gravity', 'weightlessness',
      'space flight', 'orbital', 'space station', 'space environment', 'space medicine',
      'cardiovascular', 'bone', 'muscle', 'physiology', 'biomedical', 'cell biology'
    ];

    // Check for space biology relevance bonus
    const spaceBiologyBonus = spaceBiologyTerms.some(term => 
      title.includes(term) || category.includes(term) || tags.includes(term)
    ) ? 50 : 0;
    score += spaceBiologyBonus;

    // Exact phrase matching (highest priority)
    if (title.includes(fullQuery)) score += 150;
    if (category.includes(fullQuery)) score += 120;
    if (tags.includes(fullQuery)) score += 100;
    if (impact.includes(fullQuery)) score += 80;

    // Individual word matching with field weights
    queryWords.forEach(word => {
      // Higher weights for title and category
      if (title.includes(word)) {
        score += spaceBiologyTerms.includes(word) ? 40 : 25; // Bonus for space biology terms
      }
      if (category.includes(word)) {
        score += spaceBiologyTerms.includes(word) ? 30 : 20;
      }
      if (tags.includes(word)) {
        score += spaceBiologyTerms.includes(word) ? 25 : 15;
      }
      if (impact.includes(word)) {
        score += spaceBiologyTerms.includes(word) ? 20 : 12;
      }
      if (link.includes(word)) score += 5;
    });

    // Boost score for multiple word matches in same field
    const titleMatches = queryWords.filter(word => title.includes(word)).length;
    if (titleMatches > 1) score += titleMatches * 10;

    // Penalize very short or generic titles
    if (title.length < 20) score *= 0.8;

    return Math.round(score);
  }

  /**
   * Expand query with synonyms and abbreviations
   */
  expandQuery(query) {
    let expandedQuery = query;
    
    // Replace abbreviations with full terms
    Object.keys(this.queryExpansions).forEach(abbrev => {
      const regex = new RegExp(`\\b${abbrev}\\b`, 'gi');
      if (regex.test(expandedQuery)) {
        expandedQuery += ' ' + this.queryExpansions[abbrev];
      }
    });
    
    return expandedQuery;
  }

  /**
   * Format results for display with enhanced descriptions
   */
  formatResults(results, maxResults = 50) {
    console.log(`📊 Formatting ${results.length} results (showing top ${Math.min(results.length, maxResults)})`);
    
    return results.slice(0, maxResults).map((pub, index) => {
      const impact = pub.Impact || pub.impact || '';
      const category = pub.Category || pub.category || '';
      
      // Create a better description by combining available fields
      let description = '';
      if (impact && impact.trim()) {
        description = impact.trim();
      } else if (category && category.trim()) {
        description = `Category: ${category.trim()}`;
      } else {
        description = 'Space biology research publication';
      }
      
      // Truncate long descriptions
      if (description.length > 200) {
        description = description.substring(0, 197) + '...';
      }
      
      const result = {
        id: pub.id || `local-${index}`,
        title: pub.Title || pub.title || 'Untitled Research',
        description: description,
        link: pub.Link || pub.link || '#',
        category: category || 'Space Biology',
        tags: pub.Tags || pub.tags || 'research, space biology',
        impact: impact,
        source: 'Local Database',
        relevanceScore: pub.relevanceScore || 0
      };
      
      console.log(`📄 Result ${index + 1}: "${result.title}" (Score: ${result.relevanceScore})`);
      return result;
    });
  }

  /**
   * Combine local + external results with external prioritized
   */
  combineResults(localResults, externalResults) {
    if (!externalResults || externalResults.length === 0) {
      return localResults;
    }

    console.log('🔄 Combining results:', {
      local: localResults.length,
      external: externalResults.length
    });
    console.log('📋 Sample external result:', externalResults[0]);
    console.log('📋 External results details:', externalResults);

    // Deduplicate external results (less aggressive)
    const uniqueExternal = [];
    const filteredOut = [];
    
    externalResults.forEach(extResult => {
      const duplicateMatch = localResults.find(localResult => 
        this.areSimilarTitles(localResult.title, extResult.title)
      );
      
      if (!duplicateMatch) {
        uniqueExternal.push({ 
          ...extResult, 
          source: 'External NASA',
          category: 'External NASA'
        });
      } else {
        filteredOut.push({
          external: extResult.title,
          local: duplicateMatch.title
        });
      }
    });
    
    console.log('🔍 Unique external after dedup:', uniqueExternal.length);
    console.log('❌ Filtered out as duplicates:', filteredOut);
    console.log('📋 Sample unique external:', uniqueExternal[0]);
    
    // If very few unique external results, be more lenient with deduplication
    if (uniqueExternal.length < 2 && externalResults.length > 2) {
      console.log('⚠️ Very few external results after deduplication. Being more lenient...');
      
      // Add some external results with less strict deduplication
      const additionalExternal = externalResults.filter(extResult => {
        const isAlreadyIncluded = uniqueExternal.some(included => 
          included.title === extResult.title
        );
        return !isAlreadyIncluded;
      }).slice(0, 3); // Add up to 3 more
      
      uniqueExternal.push(...additionalExternal.map(result => ({
        ...result,
        source: 'External NASA',
        category: 'External NASA'
      })));
      
      console.log(`➕ Added ${additionalExternal.length} more external results with lenient deduplication`);
    }

    // Priority order: External results first, then local results
    const combined = [
      ...uniqueExternal.map(result => ({
        ...result,
        adjustedScore: (result.relevanceScore || result.relevance * 100 || 80) + 10 // Boost external
      })),
      ...localResults.map(result => ({
        ...result,
        adjustedScore: result.relevanceScore || 0
      }))
    ];

    const finalResults = combined
      .sort((a, b) => b.adjustedScore - a.adjustedScore)
      .slice(0, 40); // Limit to top 40 results
    
    console.log('🎯 Final combined results:', finalResults.length);
    console.log('📊 Result sources breakdown:', {
      external: finalResults.filter(r => r.source?.includes('External')).length,
      local: finalResults.filter(r => !r.source?.includes('External')).length
    });
    console.log('📋 First few final results:', finalResults.slice(0, 3).map(r => ({
      title: r.title?.substring(0, 50) + '...',
      source: r.source,
      score: r.adjustedScore
    })));
    
    return finalResults;
  }

  /**
   * Check if two titles are similar (potential duplicates)
   */
  areSimilarTitles(title1, title2) {
    if (!title1 || !title2) return false;
    
    const normalize = (str) => str.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const norm1 = normalize(title1);
    const norm2 = normalize(title2);
    
    // Exact match
    if (norm1 === norm2) return true;
    
    // Very high overlap in words (90%+ common words) - less aggressive
    const words1 = norm1.split(/\s+/).filter(w => w.length > 2); // Ignore short words
    const words2 = norm2.split(/\s+/).filter(w => w.length > 2);
    const commonWords = words1.filter(word => words2.includes(word));
    
    const overlapRatio = commonWords.length / Math.min(words1.length, words2.length);
    return overlapRatio > 0.95; // Very strict threshold - only filter near-identical titles
  }

  /**
   * Get cached results
   */
  getCached(query) {
    const cached = this.cache.get(query);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(query);
      return null;
    }

    return cached.data;
  }

  /**
   * Cache results
   */
  setCache(query, data) {
    this.cache.set(query, {
      data,
      timestamp: Date.now()
    });

    if (this.cache.size > 50) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export default new ContentSearchService();