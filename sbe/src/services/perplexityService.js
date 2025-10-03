// src/services/perplexityService.js
export class PerplexityService {
  constructor() {
    this.apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    this.baseUrl = 'https://api.perplexity.ai/chat/completions';
    
    // NASA resource domains for focused search
    this.nasaDomains = [
      'nasa.gov/osdr',
      'public.ksc.nasa.gov/nslsl',
      'taskbook.nasaprs.com',
      'osdr.nasa.gov'
    ];
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
          model: 'sonar',
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

  /**
   * Search NASA resources using Perplexity AI with domain-specific focus
   * This searches across OSDR, NSLSL, and Task Book databases
   */
  async searchNASAResources(userQuery, options = {}) {
    if (!this.apiKey) {
      console.warn('Perplexity API key not found');
      return {
        success: false,
        error: 'API key not configured',
        fallback: true
      };
    }

    const {
      maxResults = 10,
      focusDomains = this.nasaDomains,
      searchType = 'comprehensive' // 'comprehensive', 'publications', 'datasets', 'grants'
    } = options;

    try {
      const domainContext = this.getDomainContext(searchType);
      
      const response = await fetch(this.baseUrl, {
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
              content: `You are a NASA Space Biology research expert. Search and summarize information from NASA's official space biology resources.

CRITICAL: Focus ONLY on these NASA domains:
- nasa.gov/osdr (Open Science Data Repository - biological experiments data)
- public.ksc.nasa.gov/nslsl (Space Life Sciences Library - publications)
- taskbook.nasaprs.com (Task Book - funded research projects)
- osdr.nasa.gov (Open Science Data Repository - additional domain)

${domainContext}

Provide a comprehensive response with:
1. Key findings and insights
2. Relevant experiments or studies
3. Important publications or datasets
4. Research gaps or opportunities
5. Actionable information for mission planning

Format your response in clear sections with citations to specific NASA resources.`
            },
            {
              role: 'user',
              content: `Search NASA space biology resources for: "${userQuery}"`
            }
          ],
          max_tokens: 2000,
          temperature: 0.2,
          search_domain_filter: focusDomains,
          return_citations: true
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      const citations = data.citations || [];

      return {
        success: true,
        query: userQuery,
        response: content,
        citations: citations,
        timestamp: new Date().toISOString(),
        searchType: searchType
      };
    } catch (error) {
      console.error('NASA search error:', error);
      return {
        success: false,
        error: error.message,
        query: userQuery
      };
    }
  }

  /**
   * Get specific insights about research gaps and opportunities
   */
  async analyzeResearchGaps(topic) {
    if (!this.apiKey) {
      return { success: false, error: 'API key not configured' };
    }

    try {
      const response = await fetch(this.baseUrl, {
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
              content: `You are a NASA research strategist analyzing space biology research gaps.

Search NASA resources (nasa.gov/osdr, public.ksc.nasa.gov/nslsl, taskbook.nasaprs.com, osdr.nasa.gov) and identify:
1. Areas of scientific progress
2. Knowledge gaps requiring additional research
3. Areas of consensus or disagreement
4. Investment opportunities
5. Critical needs for Moon/Mars missions

Provide actionable insights for research managers and mission architects.`
            },
            {
              role: 'user',
              content: `Analyze research gaps and opportunities in: "${topic}"`
            }
          ],
          max_tokens: 1500,
          temperature: 0.3,
          search_domain_filter: this.nasaDomains
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        topic: topic,
        analysis: data.choices[0].message.content,
        citations: data.citations || [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Gap analysis error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get domain-specific context for different search types
   */
  getDomainContext(searchType) {
    const contexts = {
      comprehensive: 'Search across all NASA resources for comprehensive information including experiments, publications, and funded projects.',
      publications: 'Focus on scientific publications and literature from the NASA Space Life Sciences Library.',
      datasets: 'Focus on experimental data and datasets from the NASA Open Science Data Repository.',
      grants: 'Focus on funded research projects and grants from the NASA Task Book.'
    };
    return contexts[searchType] || contexts.comprehensive;
  }

  /**
   * Extract structured data from NASA search results
   */
  async extractStructuredData(searchResults) {
    if (!this.apiKey || !searchResults.response) {
      return null;
    }

    try {
      const response = await fetch(this.baseUrl, {
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
              content: `Extract structured data from NASA search results. Return ONLY valid JSON with this structure:
{
  "experiments": [{"title": "", "link": "", "summary": ""}],
  "publications": [{"title": "", "authors": "", "year": "", "link": ""}],
  "datasets": [{"title": "", "type": "", "link": ""}],
  "keyFindings": ["finding1", "finding2"],
  "researchGaps": ["gap1", "gap2"],
  "categories": ["category1", "category2"]
}`
            },
            {
              role: 'user',
              content: `Extract structured data from: ${searchResults.response}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`Extraction error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        console.warn('Failed to parse structured data');
        return null;
      }
    } catch (error) {
      console.error('Structured data extraction error:', error);
      return null;
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
