/* HINDI NA TAYO MAGLALAGAY NG ELEMENTS DIRECTLY DITO */
/* PUT IT ON THEIR RESPECTIVE PAGES */
/* YIPEEEE */

import React, { useState, useEffect } from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // page routing
import NavBar from './components/navBar';
// import NASASearch from './components/NASASearch';
// import AppLogo from './assets/app_logos/bioseeker_black.png'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // will be used for page routing
// pages
import LandingPage from './components/pages/LandingPage';
import BrowsePage from './components/pages/BrowsePage';
import ResultsPage from './components/pages/ResultsPage';

export default function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div role='application' aria-label='Space Biology Search Engine'>
        <Routes>
          <Route path='/'
          element={<LandingPage theme={theme} toggleTheme={toggleTheme} />}
            />
          <Route path='/browse'
          element={<BrowsePage theme={theme} toggleTheme={toggleTheme} />}
            />
          <Route path='/results'
          element={<ResultsPage theme={theme} toggleTheme={toggleTheme} />}
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