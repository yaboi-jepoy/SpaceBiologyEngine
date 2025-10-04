import React from 'react';
import '../../styles/pages/BrowsePage.css';
import SideBar from '../SideBar';
import CategoryCard from '../categoryCard';

// categories galing csv
// what if gawing key-pair value for
// Title and Links (or title - description - links)
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
  return (
    <div>
      <div className="browse-container">
        <SideBar theme={theme} setTheme={setTheme} />
        <div className="browse-header">
          <h1 className="browse-main-title">Browse Categories</h1>
          <p className="browse-subtitle">
            Which branch of biology sparks your curiosity?
          </p>
        </div>
        <div className='categories-grid'>
          {categories.map((category, desc) => (
            <CategoryCard title={category[0]} desc={category[1]}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrowsePage;