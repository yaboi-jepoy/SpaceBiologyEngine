import React from 'react';
import '../../styles/pages/ResultsPage.css';
import SearchEntry from '../searchEntry';
import SearchBar from '../searchBar';
import AiBox from '../aiBox';

export default function ResultsPage() {
  // REPLACE WITH ACTUAL FUNCTION
  // THESE ARE JUST DUMMY DATA FOR STYLING
  const searchQuery = {};
  const testEntries = [
    {
      title: "Microgravity Effects on Plant Growth",
      description: "A comprehensive study examining how reduced gravity conditions affect cellular development in Arabidopsis thaliana during space missions.",
      tags: "microgravity, plant biology, space research"
      
    },
    {
      title: "Radiation Exposure in Deep Space",
      description: "Analysis of cosmic radiation impact on biological systems during long-duration space flights to Mars and beyond.",
      tags: "radiation, DNA damage, space medicine"
    },
    {
      title: "Bone Density Loss in Astronauts",
      description: "Research on calcium absorption and bone mineral density changes in crew members during extended stays on the International Space Station.",
      tags: "bone health, calcium, ISS research"
    },
    {
      title: "Protein Crystallization in Space",
      description: "Investigation of protein crystal growth in microgravity conditions to improve pharmaceutical research and drug development.",
      tags: "protein research, crystallization, pharmaceuticals"
    },
    {
      title: "Sleep Patterns in Space Missions",
      description: "Study of circadian rhythms and sleep quality in astronauts during long-duration space flights.",
      tags: "sleep research, circadian rhythm, astronaut health"
    }
  ];

  return (
    <div className="results-container">
      <div className="results-header">
        <SearchBar 
          query={""}
          className={"results-searchbar-input"}
          ariaLabel={"results-searchbar"}
          placeholder={"placeholder"}
        />
        <p className='results-header-text'>Here are the search results for </p>
        <p className='results-header-subtext'> ({testEntries.length} entries)</p>
      </div>
      
      <div className="results-list">
        <AiBox 
          title={"What is Love?"}
          description={'Maeilgachi yeonghwa sogeseona,\nChaek sogeseona,\nDeurama sogeseo sarangeul neukkyeo \nMmm, sarangeul baewo'}
          tags={"twice, what is love, jyp"}
        />
        {testEntries.map((entry, index) => (
          <SearchEntry 
            key={index}
            title={entry.title}
            description={entry.description}
            tags={entry.tags}
            className = "results-entry"
          />
        ))}
      </div>
    </div>
  );
}