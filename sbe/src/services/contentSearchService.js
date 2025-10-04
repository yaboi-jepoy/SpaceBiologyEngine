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
  }

  /**
   * Search through publications array (from Firestore)
   */
  searchPublications(publications, query, filters = {}) {
    if (!query || !publications || publications.length === 0) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2);

    // Score and filter
    const scoredResults = publications
      .map(pub => {
        const score = this.calculateRelevanceScore(pub, queryWords, lowerQuery);
        return { ...pub, relevanceScore: score };
      })
      .filter(pub => pub.relevanceScore > 0);

    // Sort by relevance
    return scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Calculate relevance score
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

    // Exact match scoring
    if (title.includes(fullQuery)) score += 100;
    if (category.includes(fullQuery)) score += 80;
    if (tags.includes(fullQuery)) score += 70;
    if (impact.includes(fullQuery)) score += 50;

    // Word match scoring
    queryWords.forEach(word => {
      if (title.includes(word)) score += 20;
      if (category.includes(word)) score += 15;
      if (tags.includes(word)) score += 15;
      if (impact.includes(word)) score += 10;
      if (link.includes(word)) score += 5;
    });

    return score;
  }

  /**
   * Format results for display - all 5 columns
   */
  formatResults(results, maxResults = 50) {
    return results.slice(0, maxResults).map((pub, index) => {
      const impact = pub.Impact || pub.impact || '';
      
      return {
        id: pub.id || index,
        title: pub.Title || pub.title || 'Untitled',
        description: impact, // Use impact as description
        link: pub.Link || pub.link || '#',
        category: pub.Category || pub.category || 'Uncategorized',
        tags: pub.Tags || pub.tags || '',
        impact: impact, // Keep impact field too
        source: 'Local Database',
        relevanceScore: pub.relevanceScore || 0
      };
    });
  }

  /**
   * Combine local + external results
   */
  combineResults(localResults, externalResults) {
    if (!externalResults || externalResults.length === 0) {
      return localResults;
    }

    const combined = [...localResults, ...externalResults];

    return combined.sort((a, b) => {
      const scoreA = a.relevanceScore || a.relevance || 0;
      const scoreB = b.relevanceScore || b.relevance || 0;
      return scoreB - scoreA;
    });
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