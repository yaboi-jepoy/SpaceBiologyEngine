import React from "react";
import '../styles/aiBox.css';

export default function AiBox({title, description, tags}) {
    return (
        <div className={"entry-ai-container"}>
            <h3 className="entry-ai-header">AI Generated Answer</h3>
            <h2 className="entry-ai-title">{title}</h2>
            <p className="entry-ai-description">{description}</p>
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