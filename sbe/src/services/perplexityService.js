// src/services/perplexityService.js
/**
 * Perplexity Service - Search external NASA sites
 */

export class PerplexityService {
  constructor() {
    this.apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    this.searchUrl = 'https://api.perplexity.ai/search';
    this.chatUrl = 'https://api.perplexity.ai/chat/completions';
    this._controllers = new Set();
    
    // 3 external NASA sites
    this.nasaDomains = [
      'science.nasa.gov',
      'public.ksc.nasa.gov',
      'taskbook.nasaprs.com'
    ];
  }

  cancelOngoing() {
    this._controllers.forEach(ctrl => ctrl.abort());
    this._controllers.clear();
  }

  _withAbort(init = {}, timeoutMs = 30000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    this._controllers.add(controller);
    
    const initWithSignal = { ...init, signal: controller.signal };
    const finalize = () => {
      clearTimeout(timeout);
      this._controllers.delete(controller);
    };
    
    return { initWithSignal, finalize };
  }

  /**
   * Search external NASA sites using Chat API (avoids CORS)
   */
  async searchExternalNASA(query, options = {}) {
    if (!this.apiKey) {
      console.warn('Perplexity API key not found');
      return { success: false, results: [] };
    }

    const { maxResults = 10 } = options;

    try {
      // Use Chat API instead of Search API to avoid CORS
      const { initWithSignal, finalize } = this._withAbort({
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [
            {
              role: 'system',
              content: 'Search NASA websites and return relevant results with titles and URLs. Focus on science.nasa.gov, public.ksc.nasa.gov, and taskbook.nasaprs.com.'
            },
            {
              role: 'user',
              content: `Search NASA websites for: "${query}". Return up to ${maxResults} results with titles, URLs, and brief descriptions.`
            }
          ],
          max_tokens: 1500,
          temperature: 0.3,
          return_citations: true
        })
      });

      const response = await fetch(this.chatUrl, initWithSignal);
      finalize();

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      const citations = data.citations || [];

      // Format citations as results
      const formattedResults = citations.map((citation, index) => ({
        title: `NASA Result ${index + 1}`,
        link: citation,
        category: 'External NASA',
        tags: this._extractTags(content),
        impact: content.slice(index * 100, (index + 1) * 100) + '...',
        source: this._getSource(citation),
        relevance: 1 - (index * 0.1),
        isExternal: true
      }));

      return {
        success: true,
        results: formattedResults
      };
    } catch (error) {
      console.error('External search error:', error);
      return { success: false, results: [] };
    }
  }

  /**
   * Generate AI summary
   */
  async generateSummary(results, userQuery) {
    if (!this.apiKey || !results || results.length === 0) {
      return null;
    }

    try {
      const context = results
        .slice(0, 10)
        .map(r => `${r.title}: ${r.impact || ''}`)
        .join('\n\n');

      const { initWithSignal, finalize } = this._withAbort({
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [
            {
              role: 'system',
              content: 'Summarize space biology research findings concisely.'
            },
            {
              role: 'user',
              content: `Query: "${userQuery}"\n\nResults:\n${context}`
            }
          ],
          max_tokens: 500,
          temperature: 0.3
        })
      });

      const response = await fetch(this.chatUrl, initWithSignal);
      finalize();

      if (!response.ok) return null;

      const data = await response.json();
      return {
        success: true,
        summary: data.choices[0].message.content
      };
    } catch (error) {
      console.error('Summary error:', error);
      return null;
    }
  }

  _getSource(url) {
    if (url.includes('science.nasa.gov')) return 'NASA Science';
    if (url.includes('ksc.nasa.gov')) return 'NASA KSC';
    if (url.includes('taskbook')) return 'NASA Task Book';
    return 'NASA External';
  }

  _extractTags(content) {
    const keywords = ['microgravity', 'space', 'ISS', 'experiment', 'biology', 'research'];
    return keywords.filter(k => content.toLowerCase().includes(k)).join(', ');
  }
}

export default new PerplexityService();