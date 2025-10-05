import '../styles/categoryCard.css';

const getCategoryDescription = (title) => {
  const descriptions = {
    'Space Biology': 'Explore how living organisms adapt and survive in the unique environment of space, including microgravity effects on biological systems.',
    'Bone & Skeletal Research': 'Investigate bone density loss, calcium metabolism, and skeletal changes that occur during spaceflight missions.',
    'Plant Biology': 'Study plant growth, photosynthesis, and agricultural possibilities in space environments for sustainable life support systems.',
    'Biomedical Research': 'Examine medical challenges of spaceflight including cardiovascular health, immune system changes, and therapeutic interventions.',
    'Bioinformatics': 'Analyze biological data from space experiments using computational methods and advanced data mining techniques.',
    'Cell Biology': 'Research cellular behavior, membrane function, and molecular processes under microgravity and radiation conditions.',
    'Genetics & Genomics': 'Study genetic expression, DNA stability, and genomic changes in organisms exposed to the space environment.',
    'Radiation Biology': 'Investigate the effects of cosmic radiation on living tissues and develop protective countermeasures for astronauts.',
    'Muscle Research': 'Examine muscle atrophy, strength loss, and exercise countermeasures to maintain astronaut health during long missions.',
    'Stem Cell Research': 'Explore stem cell behavior, regenerative potential, and therapeutic applications in space medicine.'
  };
  
  return descriptions[title] || `Discover cutting-edge research in ${title.toLowerCase()} and its applications for space exploration.`;
};

const getCategoryIcon = (title) => {
  const icons = {
    'Space Biology': '🚀',
    'Bone & Skeletal Research': '🦴',
    'Plant Biology': '🌱',
    'Biomedical Research': '🩺',
    'Bioinformatics': '💻',
    'Cell Biology': '🔬',
    'Genetics & Genomics': '🧬',
    'Radiation Biology': '☢️',
    'Muscle Research': '💪',
    'Stem Cell Research': '🧫'
  };
  
  return icons[title] || '📋';
};

export default function CategoryCard({ title, onClick }) {
  return (
    <div className="category-card" onClick={() => onClick(title)}>
      <div className="category-icon">{getCategoryIcon(title)}</div>
      <h3 className="category-title">{title}</h3>
      <p className="category-desc">
        {getCategoryDescription(title)}
      </p>
      <div className="category-action">
        <span className="explore-text">Click to explore research →</span>
      </div>
    </div>
  );
}