import React from 'react';
import '../../styles/pages/BrowsePage.css';
import SideBar from '../SideBar';
import CategoryCard from '../categoryCard';

// categories galing csv
// what if gawing key-pair value for
// Title and Links (or title - description - links)
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
  return (
      <div className="browse-container">
        <SideBar theme={theme} setTheme={setTheme} />
        <h1 className="browse-main-title">Browse Categories</h1>
        <div className='categories-grid'>
          {categories.map((category, index) => (
            <CategoryCard title={category} className={"category-card"}/>
          ))}
        </div>
        </div>
  );
}

export default BrowsePage;