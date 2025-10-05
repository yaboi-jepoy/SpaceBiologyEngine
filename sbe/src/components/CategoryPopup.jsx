import React, { useState, useEffect } from 'react';
import '../styles/CategoryPopup.css';
import usePublications from '../hooks/usePublications';

const CategoryPopup = ({ category, isOpen, onClose }) => {
  const { publications, loading } = usePublications();
  const [filteredPublications, setFilteredPublications] = useState([]);

  useEffect(() => {
    if (!isOpen || !publications.length) return;

    // Filter publications by category
    const filtered = publications.filter(pub => {
      const title = pub.Title?.toLowerCase() || '';
      const impact = pub.Impact?.toLowerCase() || '';
      const categoryLower = category.toLowerCase();
      
      // Category-specific keyword matching
      const categoryKeywords = getCategoryKeywords(categoryLower);
      
      return categoryKeywords.some(keyword => 
        title.includes(keyword) || impact.includes(keyword)
      );
    });

    setFilteredPublications(filtered.slice(0, 20)); // Limit to 20 results
  }, [category, publications, isOpen]);

  const getCategoryKeywords = (category) => {
    const keywordMap = {
      'space biology': ['space', 'microgravity', 'zero gravity', 'weightless', 'orbit', 'iss', 'station'],
      'bone & skeletal research': ['bone', 'skeletal', 'osteo', 'calcium', 'mineral', 'fracture', 'density'],
      'plant biology': ['plant', 'photosynthesis', 'growth', 'seedling', 'arabidopsis', 'botanical'],
      'biomedical research': ['biomedical', 'medical', 'clinical', 'therapeutic', 'treatment', 'disease'],
      'bioinformatics': ['bioinformatics', 'computational', 'algorithm', 'data mining', 'genomics', 'sequence'],
      'cell biology': ['cell', 'cellular', 'membrane', 'nucleus', 'mitochondria', 'protein'],
      'genetics & genomics': ['genetic', 'genome', 'dna', 'gene', 'mutation', 'chromosome'],
      'radiation biology': ['radiation', 'cosmic', 'exposure', 'dose', 'radioactive', 'ionizing'],
      'muscle research': ['muscle', 'muscular', 'atrophy', 'strength', 'fiber', 'contraction'],
      'stem cell research': ['stem cell', 'regenerative', 'differentiation', 'pluripotent', 'progenitor']
    };
    
    return keywordMap[category] || [category.replace(/[&\s]+/g, ' ').split(' ')[0]];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2 className="popup-title">{category} Publications</h2>
          <button className="popup-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="popup-body">
          {loading ? (
            <div className="popup-loading">
              <p>Loading publications...</p>
            </div>
          ) : filteredPublications.length > 0 ? (
            <div className="publications-list">
              <p className="results-count">
                Found {filteredPublications.length} publications in {category}
              </p>
              {filteredPublications.map((pub, index) => (
                <div
                  key={index}
                  className="publication-item"
                  onClick={() => pub.Link && window.open(pub.Link, '_blank')}
                  style={{ cursor: pub.Link ? 'pointer' : 'default' }}
                >
                  <h3 className="publication-title">
                    {pub.Link ? (
                      <a href={pub.Link} target="_blank" rel="noopener noreferrer">
                        {pub.Title}
                      </a>
                    ) : (
                      pub.Title
                    )}
                  </h3>
                  
                  {pub.Impact && (
                    <p className="publication-impact">{pub.Impact}</p>
                  )}
                  
                  <div className="publication-meta">
                    {pub.Date && (
                      <span className="publication-date">
                        📅 {formatDate(pub.Date)}
                      </span>
                    )}
                    {/* Always show the main selected category as a tag */}
                    <span className="publication-category main-category">
                      🏷️ {category}
                    </span>
                    {/* Show other categories/tags if available and different from the main category */}
                    {pub.Category && pub.Category !== category && (
                      <span className="publication-category other-category">
                        🏷️ {pub.Category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No publications found for {category}.</p>
              <p className="suggestion">Try browsing other categories or use the search function.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPopup;