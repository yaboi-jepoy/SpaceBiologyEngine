import React from "react";
import '../styles/aiBox.css';

// Process markdown-style formatting and make references clickable
function processMarkdown(text, results = []) {
  if (!text) return text;
  
  // Convert **bold** to <strong> (more robust pattern)
  text = text.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  
  // Convert *italic* to <em> (avoid conflicts with bold)
  text = text.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');
  
  // Convert section headers (lines starting with **)
  text = text.replace(/^\*\*([^*]+?)\*\*:\s*/gm, '<h4 class="summary-section">$1:</h4>');
  
  // Convert numbered lists with better spacing
  text = text.replace(/^(\d+)\.\s+/gm, '<div class="list-item"><strong>$1.</strong> ');
  text = text.replace(/(<div class="list-item">.*?)(?=\n(?:\d+\.\s+|\n|$))/gs, '$1</div>');
  
  // Convert bullet points
  text = text.replace(/^[\u2022\-\*]\s+(.+)/gm, '<div class="bullet-item">• $1</div>');
  
  // Process references [1], [2], etc. and make them scroll to articles within page
  text = text.replace(/\[(\d+)\]/g, (match, num) => {
    const index = parseInt(num) - 1;
    if (results && results[index]) {
      const scrollId = results[index].scrollId || `result-${index}`;
      return `<a href="#${scrollId}" class="reference-link" title="${results[index].title || 'Reference'}" onclick="document.getElementById('${scrollId}')?.scrollIntoView({behavior: 'smooth', block: 'center'});">[${num}]</a>`;
    }
    return `<span class="reference-number">[${num}]</span>`;
  });
  
  // Convert paragraph breaks with proper spacing
  text = text.replace(/\n\n+/g, '</p><p>');
  text = text.replace(/\n/g, '<br/>');
  
  // Wrap in paragraph tags if not already structured
  if (!text.includes('<p>') && !text.includes('<div>') && !text.includes('<h4>')) {
    text = '<p>' + text + '</p>';
  }
  
  return text;
}

export default function AiBox({title, description, tags, results}) {
    return (
        <div className={"entry-ai-container"}>
            <h3 className="entry-ai-header">AI Generated Answer</h3>
            <h2 className="entry-ai-title">{title}</h2>
            <div 
                className="entry-ai-description" 
                dangerouslySetInnerHTML={{ __html: processMarkdown(description, results) }}
            />
            <div className="entry-ai-tags-container">
                <p className="entry-ai-tags-text">Related Tags: </p>
                <p className="entry-ai-tags-content">
                    {Array.isArray(tags) 
                    ? tags.map((tag, index) => <span key={index} className="tag">{tag}</span>)
                    : <span className="tag">{tags}</span>
                }
                </p>
            </div>
        </div>
    )
}