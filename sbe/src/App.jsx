import React, { useState, useEffect} from 'react';
import './styles/App.css';
import SearchBar from './components/searchbar';
import NavBar from './components/navBar';
// import NASASearch from './components/NASASearch';
// import AppLogo from './assets/app_logos/bioseeker_black.png'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // will be used for page routing
// pages
import LandingPage from './components/pages/LandingPage';
import BrowsePage from './components/pages/BrowsePage';
import ResultsPage from './components/pages/ResultsPage';

export default function App() {
  const [theme, setTheme] = useState('dark');
  // const [activeView, setActiveView] = useState('home');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

/* HINDI NA TAYO MAGLALAGAY NG ELEMENTS DIRECTLY DITO */
/* PUT IT ON THEIR RESPECTIVE PAGES */
/* YIPEEEE */

  return (
    <Router>
      <div role='application' aria-label='Space Biology Search Engine'>
        {/* <NavBar theme={theme} setTheme={setTheme} /> */}
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/browse' element={<BrowsePage />}/>
          <Route path='/results' element={<ResultsPage />}/>
        </Routes>
      </div>
    </Router>
    // sample sa app.jsx -jepoyyskzie
    // sample sa app.jsx - james
    // another sample ni jepoy
  )
}