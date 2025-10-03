import React, { useState, useEffect} from 'react';
import './App.css';
import SearchBar from './components/searchbar';
import NavBar from './components/navBar';
import NASASearch from './components/NASASearch';
import AppLogo from './assets/app_logos/bioseeker_black.png'

export default function App() {
  const [theme, setTheme] = useState('light');
  const [activeView, setActiveView] = useState('home');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div role="application" aria-label="Space Biology Search Engine">
      <NavBar theme={theme} setTheme={setTheme} activeView={activeView} setActiveView={setActiveView} />
      
      {activeView === 'home' && (
        <main className='container'>
          <img 
            src={AppLogo} 
            className='logo main' 
            alt='Russtronauts Team Logo - Space Biology Engine'
            role="img"
          />
          <div className='home-text'>
            <h1 className='title' id="main-heading">Welcome to BioSeeker!</h1>
            <p className='supp-text'>What are you curious about?</p>
          </div>
          <SearchBar />
          <p className="sub-note">
            or explore <a onClick={() => setActiveView('nasa')} tabIndex="0" role="link" aria-label="NASA Knowledge Engine" style={{cursor: 'pointer'}}>NASA Knowledge Engine</a>...
          </p>
        </main>
      )}

      {activeView === 'nasa' && (
        <main className='container'>
          {/* <NASASearch /> */}
          <h1 className='title-1'>NASA Knowledge Engine</h1>
          <p style={{textAlign: 'center', color: '#666', marginTop: '20px'}}>
            NASA Knowledge Engine coming soon...
          </p>
        </main>
      )}

      {activeView === 'browse' && (
        <main className='container'>
          <h1 className='title-1'>Browse Topics</h1>
          <p style={{textAlign: 'center', color: '#666', marginTop: '20px'}}>
            Browse functionality coming soon...
          </p>
        </main>
      )}

      {activeView === 'about' && (
        <main className='container'>
          <h1 className='title-1'>About</h1>
          <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'left', padding: '20px'}}>
            <h3>Space Biology Knowledge Engine</h3>
            <p>
              This platform enables exploration of NASA's space biology research through AI-powered search
              across 608+ publications from three key NASA resources:
            </p>
            <ul>
              <li><strong>OSDR</strong> - Open Science Data Repository with 500+ biological experiments</li>
              <li><strong>NSLSL</strong> - Space Life Sciences Library with global research literature</li>
              <li><strong>Task Book</strong> - NASA-funded research projects and grants</li>
            </ul>
            <p>
              Our AI-enhanced search helps scientists, mission planners, and researchers discover insights,
              identify research gaps, and make data-driven decisions for future space exploration.
            </p>
          </div>
        </main>
      )}
    </div>
  )
}