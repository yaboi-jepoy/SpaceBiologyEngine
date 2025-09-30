import React, { useState, useEffect} from 'react';
import './App.css';
import SearchBar from './components/searchbar';
import NavBar from './components/navBar';
import TeamLogo from './assets/teamlogo.png'

export default function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div>
      <NavBar theme={theme} setTheme={setTheme} />
      <div className='container'>
        <img src={TeamLogo} className='logo main' alt='Team Logo'/>
        <h1>Space Biology Search</h1>
        <SearchBar />
      </div>
    </div>
  )
}