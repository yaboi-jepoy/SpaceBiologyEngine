// src/services/perplexityService.js
export class PerplexityService {
  constructor() {
    this.apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    this.baseUrl = 'https://api.perplexity.ai/chat/completions';
  }

  async enhanceSearchQuery(userQuery) {
    if (!this.apiKey) {
      console.warn('Perplexity API key not found, using fallback');
      return this.fallbackQueryEnhancement(userQuery);
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: `You are a space biology research assistant. For a given search query, extract relevant keywords and suggest related terms for scientific literature search.

              Return ONLY a JSON object with this structure:
              {
                "originalQuery": "user's original query",
                "keywords": ["keyword1", "keyword2", ...],
                "scientificTerms": ["term1", "term2", ...],
                "categories": ["category1", "category2", ...],
                "tags": ["tag1", "tag2", ...]
              }

              Focus on space biology, microgravity, astronaut health, space medicine, astrobiology, and related research fields.
              
              Categories might include: "Microgravity Effects", "Astronaut Health", "Plant Biology", "Cell Biology", "Radiation", "Bone Density", "Muscle Atrophy", "Cardiovascular", "Neuroscience", "Genetics", "Biotechnology"
              
              Tags should be specific research terms, experimental conditions, or methodologies.`
            },
            {
              role: 'user',
              content: `Enhance this search query for space biology research: "${userQuery}"`
            }
          ],
          max_tokens: 300,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        const parsed = JSON.parse(content);
        return {
          ...parsed,
          success: true
        };
      } catch (parseError) {
        console.warn('Failed to parse Perplexity response, using fallback');
        return this.fallbackQueryEnhancement(userQuery);
      }
    } catch (error) {
      console.error('Perplexity API error:', error);
      return this.fallbackQueryEnhancement(userQuery);
    }
  }

  fallbackQueryEnhancement(query) {
    // Simple fallback enhancement
    const words = query.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(word));
    
    // Add common space biology synonyms
    const synonymMap = {
      'space': ['microgravity', 'orbital', 'astronaut', 'cosmic'],
      'bone': ['skeletal', 'osteo', 'calcium'],
      'muscle': ['muscular', 'atrophy', 'strength'],
      'cell': ['cellular', 'biology', 'growth'],
      'plant': ['botanical', 'agriculture', 'photosynthesis']
    };

    let enhancedKeywords = [...words];
    words.forEach(word => {
      if (synonymMap[word]) {
        enhancedKeywords.push(...synonymMap[word]);
      }
    });

    return {
      originalQuery: query,
      keywords: enhancedKeywords,
      scientificTerms: words,
      categories: [],
      tags: words,
      success: false,
      fallback: true
    };
  }
}

export default new PerplexityService();
