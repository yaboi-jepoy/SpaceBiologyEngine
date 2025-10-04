import React from 'react';
import { useState } from 'react';
import '../../styles/pages/LandingPage.css';    // NEW CSS
import SideBar from '../SideBar'; // import sidebar
import blackLogo from '../../assets/app_logos/bioseeker_black.png';
import whiteLogo from '../../assets/app_logos/bioseeker_white.png';
// import FloatingButton from '../floatingButton';

const LandingPage = ({ theme, setTheme }) => {
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className={`nasa-search-container`}>
      {/* SIDEBAR */}
      <SideBar theme={theme} setTheme={toggleTheme} />
      <div id='main-page'>
        {/* LOGO */}
        <img
        src={theme === 'light' ? blackLogo : whiteLogo}
        className='landing-logo'
        alt='BioSeeker Logo'
        />
        {/* TITLE AND SUBTITLE */}
        <div className="nasa-search-header">
          <h1 className="nasa-title">BioSeeker</h1>
          <p className="nasa-subtitle">Your space biology searcher tool!</p>
        </div>
        {/* SEARCHBAR */}
        {/* PUT COMPONENT HERE */}
      </div>
    </div>
  );
}

export default LandingPage;