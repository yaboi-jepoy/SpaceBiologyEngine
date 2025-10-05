import React from "react";
import '../styles/searchEntry.css';

// .JSX FOR THE RESULTS ENTRIES

// Process simple markdown formatting for titles and descriptions
function processSimpleMarkdown(text) {
  if (!text) return text;
  
  // Convert **bold** to <strong>
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert *italic* to <em> (but not if it's part of **bold**)
  text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  
  // Clean up any remaining markdown artifacts
  text = text.replace(/[\[\]]/g, ''); // Remove square brackets
  
  return text;
}

export default function SearchEntry({title, description, tags, link, source, className, relevanceScore}) {
    // Format link for display
    const formatLinkDisplay = (url) => {
        if (!url || url === '#') return null;
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace('www.', '');
        } catch {
            return url;
        }
    };

    const linkDisplay = formatLinkDisplay(link);

    return (
        <div className={`entry-container ${className || ''}`}>
            {/* Title as hyperlink or plain text */}
            {link && link !== '#' ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className="title-link">
                    <h3 
                        className="title" 
                        dangerouslySetInnerHTML={{ __html: processSimpleMarkdown(title) }}
                    />
                </a>
            ) : (
                <div>
                    <h3 
                        className="title" 
                        dangerouslySetInnerHTML={{ __html: processSimpleMarkdown(title) }}
                    />
                    <span className="no-link-notice">📄 Article available in NASA database (direct link unavailable)</span>
                </div>
            )}
            
            {/* Description */}
            {description && (
                <div 
                    className="entry-description" 
                    dangerouslySetInnerHTML={{ __html: processSimpleMarkdown(description) }}
                />
            )}
            
            {/* Source and relevance info */}
            <div className="entry-metadata">
                {source && (
                    <span className="entry-source">{source}</span>
                )}
                {relevanceScore && (
                    <span className="entry-relevance">Score: {Math.round(relevanceScore)}</span>
                )}
            </div>
            
            {/* Tags */}
            {tags && (
                <div className="entry-tags">
                    {Array.isArray(tags) 
                        ? tags.map((tag, index) => <span key={index} className="tag">{tag}</span>)
                        : <span className="tag">{tags}</span>
                    }
                </div>
            )}
        </div>
    )
}