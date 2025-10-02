import React, { useState, useEffect} from 'react';
import './App.css';
import SearchBar from './components/searchbar';
import NavBar from './components/navBar';
import LogoWhite from './assets/app_logos/bioseeker_logo_white.png'

export default function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div>
      <NavBar theme={theme} setTheme={setTheme} />
      <div className='container'>
        <img src={LogoWhite} className='logo main' alt='Team Logo'/>
        <div className='title'>
          <h1>What are you looking for?</h1>
          <p>Supporting text here.</p>
        </div>
        <SearchBar />
        <p className="sub-note">or check topics in the <a>Browse</a> tab...</p>
      </div>
    </div>
  )
}