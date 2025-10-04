import React from "react";
import '../styles/searchEntry.css';

// .JSX FOR THE RESULTS ENTRIES

export default function SearchEntry({title, description, tags, link, source, className, id, highlighted}) {
    return (
        <div
          id={id}
          className={`entry-container ${className || ''}${highlighted ? ' highlighted' : ''}`}
        >
            {/* Title with optional link */}
            {link ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className="title-link">
                    <h3 className="title">{title}</h3>
                </a>
            ) : (
                <h3 className="title">{title}</h3>
            )}
            
            {/* Description */}
            <p className="entry-description">{description}</p>
            
            {/* Source badge */}
            {source && (
                <span className="entry-source">{source}</span>
            )}
            
            {/* Tags */}
            <div className="entry-tags">
                {Array.isArray(tags) 
                    ? tags.map((tag, index) => <span key={index} className="tag">{tag}</span>)
                    : tags && <span className="tag">{tags}</span>
                }
            </div>
        </div>
    )
}