import React, { useState } from 'react';
import '../../styles/pages/BrowsePage.css';
import SideBar from '../SideBar';
import CategoryCard from '../categoryCard';
import CategoryPopup from '../CategoryPopup';

const categories = [
  ['Space Biology', 'The study of how living organisms grow and adapt in space environments.'],
  ['Bone & Skeletal Research', ' Investigation of bone structure, growth, diseases, and repair mechanisms.'],
  ['Plant Biology', 'The study of plant life, including growth, development, and physiology.'],
  ['Biomedical Research', 'Research aimed at understanding human health and disease to develop medical treatments.'],
  ['Bioinformatics', 'The use of computational tools to analyze biological data, especially genetic information.'],
  ['Cell Biology', 'The study of cell structure, function, and processes.'],
  ['Genetics & Genomics', 'The study of genes, heredity, and the complete genetic makeup of organisms.'],
  ['Radiation Biology', 'The examination of the effects of ionizing radiation on living organisms.'],
  ['Muscle Research', 'The study of muscle function, structure, and diseases.'],
  ['Stem Cell Research', 'Exploration of stem cells for their potential to regenerate damaged tissues and treat diseases.'],
];

const BrowsePage = ({ theme, setTheme }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="browse-container">
      <SideBar theme={theme} setTheme={setTheme} />
      <div className="browse-content">
        <h1 className="browse-main-title">Browse Categories</h1>
        <p className="browse-subtitle">
          Explore NASA's space biology research organized by scientific discipline
        </p>
        <div className='categories-grid'>
          {categories.map((category, index) => (
            <CategoryCard title={category} className={"category-card"}/>
          ))}
        </div>
      </div>
      
      <CategoryPopup 
        category={selectedCategory}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </div>
  );
};

export default BrowsePage;