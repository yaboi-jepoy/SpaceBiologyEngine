import React from "react";
import '../styles/searchEntry.css';

// .JSX FOR THE RESULTS ENTRIES

export default function SearchEntry({title, description, tags, className}) {
    return (
        <div className={`entry-container ${className || ''}`}>
            <h3 className="title">{title}</h3>
            <p className="entry-description">{description}</p>
            <div className="entry-tags">
                {Array.isArray(tags) 
                    ? tags.map((tag, index) => <span key={index} className="tag">{tag}</span>)
                    : <span className="tag">{tags}</span>
                }
            </div>
        </div>
    )
}