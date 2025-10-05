import React, { useState } from 'react';
import '../../styles/pages/BrowsePage.css';
import SideBar from '../SideBar';
import CategoryCard from '../categoryCard';
import CategoryPopup from '../CategoryPopup';

const categories = [
  'Space Biology',
  'Bone & Skeletal Research',
  'Plant Biology',
  'Biomedical Research',
  'Bioinformatics',
  'Cell Biology',
  'Genetics & Genomics',
  'Radiation Biology',
  'Muscle Research',
  'Stem Cell Research',
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
            <CategoryCard 
              key={index}
              title={category} 
              onClick={handleCategoryClick}
            />
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