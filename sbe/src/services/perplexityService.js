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
              content: 'You are a NASA-only search assistant. ONLY search and return results from these exact NASA domains: science.nasa.gov/osdr, public.ksc.nasa.gov/nslsl, and taskbook.nasaprs.com. DO NOT include Wikipedia, general websites, or any non-NASA sources. Return results in JSON array format.'
            },
            {
              role: 'user',
              content: `Search ONLY these NASA websites for: "${query}". REQUIRED domains: science.nasa.gov/osdr (NASA OSDR), public.ksc.nasa.gov/nslsl (NASA Space Life Sciences Library), taskbook.nasaprs.com (NASA Task Book). 

Return up to ${maxResults} results in this EXACT JSON format:
[
  {
    "title": "Exact publication or page title",
    "url": "Full URL",
    "description": "Brief 1-2 sentence summary",
    "tags": ["keyword1", "keyword2", "keyword3"]
  }
]

ONLY include results from NASA domains. Reject Wikipedia or non-NASA sources.`
            }
          ],
          max_tokens: 2000,
          temperature: 0.3,
          return_citations: true,
          search_domain_filter: ['science.nasa.gov', 'public.ksc.nasa.gov', 'taskbook.nasaprs.com']
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

      // parse ng json 
      let parsedResults = [];
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedResults = JSON.parse(jsonMatch[0]);
          console.log('Parsed structured results from AI:', parsedResults.length);
        }
      } catch (parseError) {
        console.warn('Could not parse JSON from AI response, using fallback method');
      }

      // pang parse ng json, filter lang yung mga results na galing sa 3 nasa resources
      if (parsedResults.length > 0) {
        const formattedResults = parsedResults
          .filter(result => {
            const url = (result.url || '').toLowerCase();
            return this.nasaDomains.some(domain => url.includes(domain));
          })
          .map((result, index) => ({
            title: result.title || 'NASA Publication',
            link: result.url || '#',
            category: 'External NASA',
            tags: Array.isArray(result.tags) ? result.tags.join(', ') : (result.tags || ''),
            impact: result.description || '',
            source: this._getSource(result.url || ''),
            relevance: 1 - (index * 0.05),
            isExternal: true
          }));

        console.log('Filtered to NASA-only results:', formattedResults.length);

        return {
          success: true,
          results: formattedResults
        };
      }

      // pag d gumana ung sa json, citation lang ang gagamitin
      const nasaCitations = citations.filter(citation => {
        const url = citation.toLowerCase();
        return this.nasaDomains.some(domain => url.includes(domain));
      });

      console.log('Fallback: Using citations', nasaCitations.length, 'from', citations.length);

      // pang extract ng title based doon sa result and data na kinuhaan nya na galing sa 3 nasa resources
      const formattedResults = nasaCitations.map((citation, index) => {
        const title = this._extractTitleFromContent(content, citation, index);
        const description = this._extractDescriptionFromContent(content, index);
        
        return {
          title: title,
          link: citation,
          category: 'External NASA',
          tags: this._extractTagsFromText(description),
          impact: description,
          source: this._getSource(citation),
          relevance: 1 - (index * 0.1),
          isExternal: true
        };
      });

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
        .map((r, index) => `[${index + 1}] ${r.title}${r.description ? ': ' + r.description : ''}${r.impact ? ' Impact: ' + r.impact : ''}`)
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
              content: `You are a NASA space biology research analyst. Create well-formatted summaries using markdown syntax:\n\n**FORMATTING REQUIREMENTS:**\n- Use **bold text** for key findings and important terms\n- Use *italics* for scientific names and emphasis\n- Use numbered references [1], [2], etc. to cite specific studies\n- Structure content with clear sections and bullet points\n- Focus on space biology, microgravity effects, and mission implications`
            },
            {
              role: 'user',
              content: `Research Query: "${userQuery}"\n\nSearch Results:\n${context}\n\nProvide a comprehensive summary with:\n\n**Key Findings**: Main discoveries related to "${userQuery}" with references [1], [2], etc.\n\n**Scientific Impact**: How this research advances our understanding of life in space\n\n**Mission Relevance**: Practical applications for future space exploration\n\nUse references [1], [2], [3] etc. to cite specific studies from the results above.`
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
      const rawSummary = data.choices[0].message.content;
      
      // Clean up the summary
      const cleanedSummary = this._cleanAIResponse(rawSummary);
      
      return {
        success: true,
        summary: cleanedSummary
      };
    } catch (error) {
      console.error('Summary error:', error);
      return null;
    }
  }

  _getSource(url) {
    if (url.includes('science.nasa.gov')) return 'NASA OSDR';
    if (url.includes('ksc.nasa.gov')) return 'NASA NSLSL';
    if (url.includes('taskbook')) return 'NASA Task Book';
    return 'NASA External';
  }

  _extractTitleFromContent(content, url, index) {
    const lines = content.split('\n');
    
    const numberPattern = new RegExp(`${index + 1}\\.\\s*(.+?)(?:\\n|$)`, 'i');
    const numberMatch = content.match(numberPattern);
    if (numberMatch && numberMatch[1]) {
      return numberMatch[1].trim().replace(/["\[\]]/g, '');
    }
    
    const urlIndex = content.indexOf(url);
    if (urlIndex > 0) {
      const before = content.substring(Math.max(0, urlIndex - 200), urlIndex);
      const titleMatch = before.match(/(?:title|Title):\s*(.+?)(?:\n|$)/i);
      if (titleMatch) {
        return titleMatch[1].trim().replace(/["\[\]]/g, '');
      }
    }
    
    return `NASA Publication ${index + 1}`;
  }

  _extractDescriptionFromContent(content, index) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    if (sentences[index]) {
      return sentences[index].trim() + '.';
    }
    
    const start = index * 150;
    const end = start + 150;
    return content.slice(start, end).trim() + '...';
  }

  _extractTagsFromText(text) {
    const keywords = [
      'microgravity', 'space', 'ISS', 'experiment', 'biology', 'research',
      'astronaut', 'plant', 'cell', 'bone', 'muscle', 'radiation',
      'Mars', 'Moon', 'gravity', 'spaceflight', 'organism', 'protein'
    ];
    
    const lowerText = text.toLowerCase();
    const foundKeywords = keywords.filter(k => lowerText.includes(k));
    
    return foundKeywords.slice(0, 5).join(', ') || 'space biology';
  }

  _extractTags(content) {
    return this._extractTagsFromText(content);
  }

  _cleanAIResponse(text) {
    if (!text) return '';
    
    let cleaned = text;
    
    // Keep citations for reference linking - don't remove [1], [2], etc.
    // cleaned = cleaned.replace(/\[\d+\](\[\d+\])*/g, ''); // REMOVED - we want to keep these
    
    // PRESERVE markdown formatting for proper display
    // Don't remove ** and * - these are needed for bold and italic formatting
    // cleaned = cleaned.replace(/\*\*/g, ''); // REMOVED
    // cleaned = cleaned.replace(/\*/g, ''); // REMOVED
    cleaned = cleaned.replace(/__/g, ''); // Remove excessive underscores
    cleaned = cleaned.replace(/_{3,}/g, ''); // Remove multiple underscores
    
    // Remove markdown links but keep the text: [text](url) -> text
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    
    // Better spacing cleanup
    cleaned = cleaned.replace(/[ \t]+/g, ' '); // Multiple spaces/tabs to single space
    cleaned = cleaned.replace(/\s+([.,;:!?])/g, '$1'); // Remove space before punctuation
    
    // Preserve structure but limit excessive line breaks
    cleaned = cleaned.replace(/\n{4,}/g, '\n\n\n'); // Max 3 consecutive line breaks
    
    // Remove common AI response prefixes
    cleaned = cleaned.replace(/^(Summary:|Answer:|Response:)\s*/i, '');
    
    cleaned = cleaned.trim();
    
    return cleaned;
  }
}

export default new PerplexityService();