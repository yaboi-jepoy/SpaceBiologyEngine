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

export default function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    console.log("Theme is:", theme);
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <Router>
      <div className='sbe-container ${theme}' role='application' aria-label='Space Biology Search Engine'>
        <Routes>
          <Route path='/'
          element={<LandingPage theme={theme} setTheme={toggleTheme} />}
            />
          <Route path='/browse'
          element={<BrowsePage theme={theme} setTheme={toggleTheme} />}
            />
          <Route path='/challenge'
          element={<ChallengePage theme={theme} setTheme={toggleTheme} />}
            />
          <Route path='/about'
          element={<AboutPage theme={theme} setTheme={toggleTheme} />}
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