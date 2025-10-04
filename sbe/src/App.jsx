/* HINDI NA TAYO MAGLALAGAY NG ELEMENTS DIRECTLY DITO */
/* PUT IT ON THEIR RESPECTIVE PAGES */
/* YIPEEEE */

import React, { useState, useEffect } from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // page routing
// import NASASearch from './components/NASASearch';
// import AppLogo from './assets/app_logos/bioseeker_black.png'
// pages
import LandingPage from './components/pages/LandingPage';
import BrowsePage from './components/pages/BrowsePage';
import ChallengePage from './components/pages/ChallengePage';
import AboutPage from './components/pages/AboutPage';
import ResultsPage from './components/pages/ResultsPage';

export default function App() {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    // Apply theme class to both html and body for better inheritance
    document.documentElement.className = theme;
    document.body.className = theme;
    // Save theme to localStorage for persistence
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className={`sbe-container`} role='application' aria-label='Space Biology Search Engine'>
        <Routes>
          <Route path='/'
          element={<LandingPage theme={theme} setTheme={setTheme} />}
            />
          <Route path='/browse'
          element={<BrowsePage theme={theme} setTheme={setTheme} />}
            />
          <Route path='/challenge'
          element={<ChallengePage theme={theme} setTheme={setTheme} />}
            />
          <Route path='/about'
          element={<AboutPage theme={theme} setTheme={setTheme} />}
            />
          <Route path='/results'
          element={<ResultsPage theme={theme} setTheme={setTheme} />}
          />
        </Routes>
      </div>
    </Router>
    // sample sa app.jsx -jepoyyskzie
    // sample sa app.jsx - james
    // another sample ni jepoy
    // isa pa - jpoy
    // eto pa isa - james
  )
}