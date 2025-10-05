import React from 'react';
import '../styles/PublicationModal.css';

function processMarkdown(text) {
  if (!text) return text;
  
  let processed = text;
  processed = processed.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
  processed = processed.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');
  processed = processed.replace(/^[\u2022\-\*]\s+(.+)/gm, '<div class="bullet-item">• $1</div>');
  processed = processed.replace(/\n/g, '<br/>');
  
  return processed;
}

export default function PublicationModal({ publication, analysis, loading, onClose }) {
  if (!publication) return null;

  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-backdrop') {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h2>Publication Analysis</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-section">
            <h3 className="section-icon">📄 Title</h3>
            <p className="publication-title">{publication.title}</p>
          </div>

          {loading ? (
            <div className="modal-loading">
              <p>⏳ Analyzing publication...</p>
            </div>
          ) : analysis ? (
            <>
              {analysis.summary && (
                <div className="modal-section">
                  <h3 className="section-icon">📊 Summary</h3>
                  <div 
                    className="section-content"
                    dangerouslySetInnerHTML={{ __html: processMarkdown(analysis.summary) }}
                  />
                </div>
              )}

              {analysis.findings && (
                <div className="modal-section">
                  <h3 className="section-icon">🔬 Key Findings</h3>
                  <div 
                    className="section-content"
                    dangerouslySetInnerHTML={{ __html: processMarkdown(analysis.findings) }}
                  />
                </div>
              )}

              {analysis.gaps && (
                <div className="modal-section">
                  <h3 className="section-icon">⚠️ Research Gaps</h3>
                  <div 
                    className="section-content"
                    dangerouslySetInnerHTML={{ __html: processMarkdown(analysis.gaps) }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="modal-error">
              <p>Failed to analyze publication. Please try again.</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {publication.link && publication.link !== '#' && (
            <a 
              href={publication.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="modal-button primary"
            >
              View Full Publication
            </a>
          )}
          <button className="modal-button secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
