import React from 'react';
import '../../styles/pages/ChallengePage.css';
import SideBar from '../SideBar'; // import sidebar
import blackLogo from '../../assets/app_logos/bioseeker_black.png';
import whiteLogo from '../../assets/app_logos/bioseeker_white.png';

const ChallengePage = ({ theme, setTheme }) => {
  return (
    <div className="challenge-container">
        <SideBar theme={theme} setTheme={setTheme} />
        <div className="challenge-page-content">
          {/* Challenge */}
          <div className="challenge-section">
            <h3>Challenge</h3>
            <h1>Build a Space Biology Knowledge Engine</h1>
          </div>
          <div className="challenge-desc">
            <p id='challenge-text'>
              Your task is to create a functional web application that utilizes AI, knowledge graphs,
              or other relevant technologies to summarize the 608 NASA bioscience publications available in the online repository.
              The application should allow users to explore the outcomes and impacts of the experiments documented in these publications.
              Consider developing a dynamic dashboard that supports interactive searching and detailed analysis of this collection.
              Focus on features that would deliver the most value to users. For instance, the tool could highlight scientific advances,
              reveal knowledge gaps, identify areas of agreement or debate, or offer practical insights for mission planners.
            </p>
            <a
            href='https://www.spaceappschallenge.org/2025/challenges/build-a-space-biology-knowledge-engine/'
            target="_blank"
            className="see-challenge">
              See Challenge Details
            </a>
          </div>
          {/* Solution */}
          <div className="solution-section">
            <h3>Solution</h3>
            <div className="solution-logo-full">
              <img className="solution-logo" src={theme === 'light' ? blackLogo : whiteLogo} alt="Bioseeker Logo" />
              <div className="app-header">
                <h1 className="app-name">
                  BioSeeker
                </h1>
                <p className="by-team">
                  By Russtronauts
                </p>
              </div>
            </div>
            <div className="solution-text">
                <p className="solution-desc">
                  Our project is a functional web application that uses AI to organize and summarize NASA's extensive space biology publications.
                  These studies look at how humans and other living systems can adapt to space conditions.
                  However, the research is spread across many technical papers, making it hard to compare them, find gaps in the information,
                  and get a clear understanding of the whole topic. This tool solves the problem by turning detailed scientific text into simple, concise,
                  and summarized explanations. It is important because it bridges the gap between technical papers and practical knowledge, helping support
                  efficient space exploration.
                </p>
              </div>
          </div>
        </div>
    </div>
  )
}

export default ChallengePage;