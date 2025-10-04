import { useState } from "react";
import '../styles/SideBar.css';
import DarkIcon from '../assets/theme_icons/dark_mode.svg'
import LightIcon from '../assets/theme_icons/light_mode.svg'
// import ThemeToggle from './ThemeToggle';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // will be used for page routing
// // pages
// import LandingPage from './pages/LandingPage';
// import BrowsePage from './pages/BrowsePage';
// import ResultsPage from './components/pages/ResultsPage';

const SideBar = ({ theme, toggleTheme }) => {
    return (
        <div className='side-bar-container'>
            <div className='side-bar-routes'>
                {/* LINKS TO PAGES */}
                <a href="#home">Home</a>
                <a href="#browse">Browse</a>
                <a href="#challenge">Challenge</a>
                <a href="#about">About</a>
                {/* TOGGLE THEME ICON */}
                <img
                onClick={toggleTheme}
                src={theme === 'light' ? DarkIcon : LightIcon}
                className='theme-toggle-btn'
                />
            </div>
        </div>
    )
}

export default SideBar;