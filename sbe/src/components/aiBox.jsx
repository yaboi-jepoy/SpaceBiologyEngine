import React from "react";
import '../styles/aiBox.css';

// Process markdown-style formatting and make references clickable
function processMarkdown(text, results = []) {
  if (!text) return text;
  
  // Convert **bold** to <strong>
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert *italic* to <em>
  text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  
  // Convert numbered lists
  text = text.replace(/^(\d+)\./gm, '<br/><strong>$1.</strong>');
  
  // Convert bullet points
  text = text.replace(/^[\u2022\-\*]\s+/gm, '<br/>• ');
  
  // Process references [1], [2], etc. and make them scroll to articles within page
  text = text.replace(/\[(\d+)\]/g, (match, num) => {
    const index = parseInt(num) - 1;
    if (results && results[index]) {
      const scrollId = results[index].scrollId || `result-${index}`;
      return `<a href="#${scrollId}" class="reference-link" title="${results[index].title || 'Reference'}" onclick="document.getElementById('${scrollId}')?.scrollIntoView({behavior: 'smooth', block: 'center'});">[${num}]</a>`;
    }
    return `<span class="reference-number">[${num}]</span>`;
  });
  
  // Add line breaks for better readability
  text = text.replace(/\n\n/g, '<br/><br/>');
  text = text.replace(/\n/g, '<br/>');
  
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