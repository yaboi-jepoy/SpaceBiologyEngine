import React from "react";
import '../styles/aiBox.css';
import ReactMarkdown from 'react-markdown';

export default function AiBox({ title, description, tags, onReferenceClick }) {
  // Convert [number] to markdown links: [number](#ref-number)
  const processedDescription = description.replace(
    /\[(\d+)\]/g,
    (match, number) => `[${number}](#ref-${number})`
  );

  // Custom renderer for reference links
  const markdownComponents = {
    a: ({ href, children }) => {
      const refMatch = href?.match(/^#ref-(\d+)$/);
      if (refMatch) {
        const refNumber = refMatch[1];
        return (
          <span
            className="ai-ref"
            onClick={() => onReferenceClick?.(refNumber)}
          >
            [{refNumber}]
          </span>
        );
      }
      return <a href={href}>{children}</a>;
    }
  };

  return (
    <div className="entry-ai-container">
      <h3 className="entry-ai-header">AI Generated Answer</h3>
      <h2 className="entry-ai-title">{title}</h2>
      <div className="entry-ai-description">
        <ReactMarkdown components={markdownComponents}>
          {processedDescription}
        </ReactMarkdown>
      </div>
      <div className="entry-ai-tags-container">
        <p className="entry-ai-tags-text">Related Tags: </p>
        <p className="entry-ai-tags-content">
          {Array.isArray(tags)
            ? tags.map((tag, idx) => (
                <span key={idx} className="tag">{tag}</span>
              ))
            : <span className="tag">{tags}</span>
          }
        </p>
      </div>
    </div>
  );
}