import React from 'react';
import '../../styles/pages/BrowsePage.css';
import SideBar from '../SideBar';

// categories galing csv
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
    <div className='browse-page'>
      <div className='browse-sidebar'>
        <SideBar theme={theme} setTheme={setTheme} />
      </div>
      <div className="browse-container">
        <h2 className="browse-title">Biology Categories</h2>
        <ul className="category-list">
          {categories.map((cat, idx) => (
          <li key={idx}>{cat}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BrowsePage;