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
      console.warn('⚠️ Perplexity API key not found. Set VITE_PERPLEXITY_API_KEY in your .env file');
      return { success: false, results: [], error: 'No API key' };
    }
    
    console.log('🔑 Using API key:', this.apiKey.substring(0, 4) + '***hidden***');

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
              content: `You are a specialized NASA space biology research assistant. Search ONLY within these specific NASA databases and sites:
              
              REQUIRED SOURCES (search only these):
              1. science.nasa.gov/biological-physical/data/ - NASA Biological & Physical Sciences data
              2. public.ksc.nasa.gov/nslsl/ - NASA Space Life Sciences Laboratory
              3. taskbook.nasaprs.com - NASA Task Book for space biology research
              
              RESTRICTIONS:
              - Do NOT search other websites, journals, or databases
              - Only return results from the 3 NASA sources above
              - Focus on space biology, microgravity effects, and ISS experiments
              - Ensure all results have valid URLs from these domains only`
            },
            {
              role: 'user',
              content: `Search for "${query}" in space biology research from these NASA sources:
              - science.nasa.gov/biological-physical/data/
              - public.ksc.nasa.gov/nslsl/
              - taskbook.nasaprs.com
              
              For each result, provide:
              1. Exact title of the specific research/article/experiment
              2. Brief description of findings
              3. **CRITICAL**: The complete, specific URL to the actual article/research page, NOT just the domain homepage
              4. Relevance to "${query}"
              
              FORMAT EXAMPLE:
              Title: "Microgravity Effects on Plant Cell Walls"
              Description: "Study of how weightlessness affects..."
              URL: https://science.nasa.gov/biological-physical/data/specific-study-page
              
              IMPORTANT: 
              - Provide SPECIFIC article/research URLs, not homepage URLs
              - If you don't have the specific URL, indicate the research exists but URL unavailable
              - Only return results from the 3 NASA domains listed above
              
              Return up to ${maxResults} results with specific URLs when available.`
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
      console.log('🔍 Full API response:', data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('❌ Invalid API response structure:', data);
        throw new Error('Invalid response from Perplexity API');
      }
      
      const content = data.choices[0].message.content || '';
      const citations = data.citations || [];

      console.log('🔍 Raw Perplexity response content:', content);
      console.log('📎 Citations found:', citations);
      console.log('🎯 Filtering for NASA-only domains...');

      // Parse content to extract titles and descriptions
      const results = this._parseSearchResults(content, citations);
      console.log('📄 Parsed results from content:', results.length);
      if (results[0]) {
        console.log('📋 Sample parsed result:');
        console.log('   Title:', results[0].title);
        console.log('   Description:', results[0].description);
        console.log('   URL:', results[0].url);
      }

      // Filter and format results to ensure they're from approved NASA domains only
      const approvedDomains = [
        'science.nasa.gov/biological-physical/data',
        'public.ksc.nasa.gov/nslsl',
        'taskbook.nasaprs.com'
      ];
      
      const formattedResults = results
        .map((result, index) => {
          const citation = citations && citations[index] ? citations[index] : null;
          const url = result.url || citation || '#';
          
          // Keep original URL for now, validate later
          let validatedUrl = url;
          
          // Basic NASA domain check (more lenient)
          const isNASADomain = url.includes('nasa.gov') || url.includes('taskbook') || url === '#';
          
          if (!isNASADomain && url !== '#') {
            console.log(`🚫 Filtered out non-NASA result: ${result.title} (${url})`);
            return null; // Filter out non-NASA results
          }
          
          // Improve URL only if it's a NASA domain
          if (isNASADomain && url !== '#') {
            validatedUrl = this._validateAndImproveUrl(url, result.title);
            console.log(`🔗 URL processed: ${result.title} -> ${validatedUrl}`);
          } else {
            console.log(`📄 No specific URL available: ${result.title}`);
          }
          
          const formattedResult = {
            title: result.title || `NASA Research ${index + 1}`,
            description: result.description || 'Space biology research from NASA',
            link: validatedUrl,
            category: 'External NASA',
            tags: this._extractTags(result.description || content),
            source: this._getSource(validatedUrl),
            relevance: 1 - (index * 0.1),
            relevanceScore: Math.round((1 - (index * 0.1)) * 100),
            isExternal: true
          };
          
          console.log(`🎯 Formatted result ${index + 1}:`, {
            title: formattedResult.title,
            description: formattedResult.description?.substring(0, 100) + '...',
            link: formattedResult.link
          });
          
          return formattedResult;
        })
        .filter(result => result !== null); // Remove filtered results

      console.log(`🎯 Final formatted results: ${formattedResults.length} out of ${results.length} original results`);
      
      // If we have content but no formatted results, create fallback results
      if (formattedResults.length === 0 && content && content.length > 100) {
        console.log('⚠️ No formatted results but content available. Creating fallback results...');
        
        // Try to extract a better title from content
        const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 10);
        const firstSentence = sentences[0] ? sentences[0].trim() : 'NASA Space Biology Research';
        const title = firstSentence.length > 80 ? firstSentence.substring(0, 77) + '...' : firstSentence;
        
        const fallbackResults = [{
          title: this._cleanTitle(title),
          description: this._cleanDescription(content.substring(100, 300) + '...'), // Skip first part, use middle
          link: citations && citations[0] ? citations[0] : 'https://science.nasa.gov/biological-physical/data/',
          category: 'External NASA',
          tags: this._extractTags(content),
          source: citations && citations[0] ? this._getSource(citations[0]) : 'NASA Bio-Physical Data',
          relevance: 0.8,
          relevanceScore: 80,
          isExternal: true
        }];
        
        return {
          success: true,
          results: fallbackResults
        };
      }

      return {
        success: true,
        results: formattedResults
      };
    } catch (error) {
      console.error('❌ External search error:', error);
      console.log('🔧 Troubleshooting tips:');
      console.log('  1. Check if VITE_PERPLEXITY_API_KEY is set correctly');
      console.log('  2. Verify API key has sufficient credits');
      console.log('  3. Check network connectivity');
      return { success: false, results: [], error: error.message };
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
              content: `You are a NASA space biology research analyst. Provide well-formatted scientific summaries using markdown syntax:
              
              FORMATTING GUIDELINES:
              - Use **bold text** for key findings and important terms
              - Use *italics* for scientific names and emphasis
              - Use numbered references [1], [2], etc. to cite specific studies
              - Structure with clear paragraphs and bullet points
              - Highlight key space biology findings
              - Explain microgravity effects on living systems
              - Connect research to practical space exploration
              - Focus on experimental results and implications`
            },
            {
              role: 'user',
              content: `Analyze these space biology research results for: "${userQuery}"
              
              Research Results:
${context}
              
              Provide a well-structured summary with:
              
              **Key Findings**: Main discoveries related to "${userQuery}" with references [1], [2], etc.
              
              **Microgravity Effects**: How space environment affects biological systems
              
              **Mission Implications**: Practical applications for space exploration
              
              **Research Methods**: Notable experimental approaches and technologies
              
              Use references [1], [2], [3] etc. to cite specific studies from the results above.`
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

  /**
   * Validate and improve URLs to ensure they point to specific content
   */
  _validateAndImproveUrl(url, title) {
    if (!url || url === '#') return '#';
    
    try {
      // Clean up the URL
      url = url.trim().replace(/[()[\]]/g, ''); // Remove parentheses and brackets
      
      // If it's just a domain, mark as unavailable rather than linking to homepage
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(part => part.length > 0);
      
      // Check if this is just a homepage (minimal path) - be more lenient
      if (pathParts.length <= 1 && !urlObj.search) {
        console.log(`⚠️ Very basic homepage URL detected for "${title}", trying to improve...`);
        // Don't immediately return '#', try to improve first
      }
      
      // For NASA Task Book, try to construct a search URL if we have a title
      if (url.includes('taskbook.nasaprs.com') && title) {
        const searchTerm = encodeURIComponent(title.split(' ').slice(0, 4).join(' ')); // Use first 4 words
        return `https://taskbook.nasaprs.com/tbp/index.cfm?action=public_query_taskbook_content&search_text=${searchTerm}`;
      }
      
      // For NASA Science, keep original URL if it's already good, otherwise improve
      if (url.includes('science.nasa.gov')) {
        if (!url.includes('/biological-physical/') && pathParts.length <= 2) {
          return 'https://science.nasa.gov/biological-physical/data/';
        }
      }
      
      // For KSC, keep original URL if it's already good, otherwise improve  
      if (url.includes('ksc.nasa.gov')) {
        if (!url.includes('/nslsl/') && pathParts.length <= 2) {
          return 'https://public.ksc.nasa.gov/nslsl/';
        }
      }
      
      // Return original URL if no improvements needed
      return url;
    } catch (error) {
      console.warn('URL validation error:', error);
      return '#';
    }
  }

  _getSource(url) {
    if (!url) return 'NASA External';
    if (url.includes('science.nasa.gov/biological-physical/data')) return 'NASA Bio-Physical Data';
    if (url.includes('public.ksc.nasa.gov/nslsl')) return 'NASA Space Life Sciences Lab';
    if (url.includes('taskbook.nasaprs.com')) return 'NASA Task Book';
    if (url.includes('science.nasa.gov')) return 'NASA Science (Other)';
    if (url.includes('ksc.nasa.gov')) return 'NASA KSC (Other)';
    return 'NASA External';
  }

  /**
   * Clean title from common markdown artifacts and formatting issues
   */
  _cleanTitle(title) {
    if (!title) return title;
    
    // Remove extra quotes and brackets
    title = title.replace(/^["'\[]+|["'\]]+$/g, '');
    
    // Clean up common prefixes that might come from parsing
    title = title.replace(/^(Title:|Research:|Study:|Paper:|Article:)\s*/i, '');
    
    // Remove markdown-style links [text](url) -> text
    title = title.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    // Clean up extra whitespace
    title = title.replace(/\s+/g, ' ').trim();
    
    return title;
  }

  /**
   * Clean description text from formatting artifacts
   */
  _cleanDescription(description) {
    if (!description) return description;
    
    // Remove common prefixes
    description = description.replace(/^(Description:|Summary:|Abstract:|Findings:|Title:)\s*/i, '');
    
    // Remove URLs that appear in descriptions
    description = description.replace(/https?:\/\/[^\s]+/g, '');
    
    // Remove markdown-style links but keep the text
    description = description.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    // Remove common field labels that leak into descriptions
    description = description.replace(/\b(URL:|Link:|Relevance:|Source:)[^.]*[.]?/gi, '');
    
    // Clean up extra whitespace and line breaks
    description = description.replace(/\s+/g, ' ').trim();
    
    // Don't include lines that are just URLs or very short
    if (/^https?:\/\//.test(description) || description.length < 10) {
      return '';
    }
    
    return description;
  }

  /**
   * Parse search results from AI response content
   */
  _parseSearchResults(content, citations) {
    const results = [];
    
    // Try to extract structured results from the content
    const lines = content.split('\n').filter(line => line.trim());
    let currentResult = null;
    
    for (const line of lines) {
      // Look for numbered results or titles
      if (/^\d+\.|^Title:|^Research:/.test(line.trim())) {
        if (currentResult) {
          results.push(currentResult);
        }
        let titleText = line.replace(/^\d+\.\s*/, '').replace(/^(Title:|Research:)\s*/, '').trim();
        
        // Check if this line contains both title and description
        if (titleText.includes('Description:')) {
          const parts = titleText.split('Description:');
          titleText = parts[0].trim();
          const descText = parts[1] ? parts[1].trim() : '';
          
          currentResult = {
            title: this._cleanTitle(titleText),
            description: this._cleanDescription(descText),
            url: null
          };
        } else {
          currentResult = {
            title: this._cleanTitle(titleText),
            description: '',
            url: null
          };
        }
      } else if (currentResult && line.trim()) {
        // Add to description (with basic cleaning)
        const cleanLine = this._cleanDescription(line.trim());
        if (cleanLine) {
          currentResult.description += (currentResult.description ? ' ' : '') + cleanLine;
        }
      }
      
      // Look for URLs in the line
      const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch && currentResult) {
        currentResult.url = urlMatch[1];
      }
    }
    
    if (currentResult) {
      results.push(currentResult);
    }
    
    // If no structured results found, create from citations (NASA only)
    if (results.length === 0 && citations.length > 0) {
      const approvedDomains = [
        'science.nasa.gov',
        'ksc.nasa.gov',
        'taskbook.nasaprs.com'
      ];
      
      // Filter citations to NASA domains only
      const nasaCitations = citations.filter(url => 
        approvedDomains.some(domain => url.includes(domain))
      );
      
      if (nasaCitations.length === 0) {
        console.log('🚫 No NASA citations found in response');
        return [];
      }
      
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
      
      return nasaCitations.map((url, index) => {
        let title = `NASA Research ${index + 1}`;
        
        if (url.includes('science.nasa.gov/biological-physical/data')) {
          title = 'NASA Bio-Physical Sciences Data';
        } else if (url.includes('public.ksc.nasa.gov/nslsl')) {
          title = 'NASA Space Life Sciences Lab';
        } else if (url.includes('taskbook.nasaprs.com')) {
          title = 'NASA Task Book Research';
        } else if (url.includes('science.nasa.gov')) {
          title = 'NASA Science Research';
        } else if (url.includes('ksc.nasa.gov')) {
          title = 'NASA Kennedy Space Center';
        }
        
        const description = sentences[index] ? 
          sentences[index].trim() + '...' : 
          content.slice(index * 100, (index + 1) * 200).trim() + '...';
          
        return { title, description, url };
      });
    }
    
    return results;
  }

  _extractTags(content) {
    const spaceBiologyKeywords = [
      // Core space biology terms
      'microgravity', 'weightlessness', 'zero gravity', 'space environment',
      
      // Biological systems
      'cell biology', 'molecular biology', 'physiology', 'genetics', 'biomedical',
      'cardiovascular', 'musculoskeletal', 'bone density', 'muscle atrophy',
      
      // Space-specific
      'ISS', 'International Space Station', 'space station', 'astronaut',
      'space flight', 'space mission', 'orbital', 'spaceflight',
      
      // Research types
      'experiment', 'study', 'investigation', 'research', 'analysis',
      'bioassay', 'clinical', 'laboratory',
      
      // Organisms
      'human', 'plant', 'animal', 'microorganism', 'bacteria', 'cell culture',
      'tissue', 'organism', 'biological sample'
    ];
    
    const foundKeywords = spaceBiologyKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return foundKeywords.slice(0, 5).join(', '); // Limit to top 5 most relevant
  }
}

export default new PerplexityService();