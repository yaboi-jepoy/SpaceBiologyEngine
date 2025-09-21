import { useState } from 'react';
import './App.css';
import SearchBar from './components/searchbar';
import Sidebar from './components/sidebar';
import viktorImage from './assets/viktor.jpg'
import ThemeToggle from './components/themetoggle';

function App() {
  return (
    <div>
      <Sidebar />
      <img src={viktorImage} alt="" className='logo main'/>
      <h1>NASA Biology Search</h1>
      <SearchBar />
      <p>or try browsing <a href="">manually</a>.</p>
      <ThemeToggle />
    </div>
  )
}

export default App;