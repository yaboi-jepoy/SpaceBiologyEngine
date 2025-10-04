import { useState } from "react";
import '../styles/SideBar.css';
import ThemeToggle from './themetoggle';
import blackLogo from '../assets/app_logos/bioseeker_black.png';
import whiteLogo from '../assets/app_logos/bioseeker_white.png';

const SideBar = ({ theme, setTheme }) => {
    return (
        <div className='side-bar-container'>
            {/* Left side - Logo */}
            <div className="logo-full">
                <img
                    src={theme === 'light' ? blackLogo : whiteLogo}
                    className='sidebar-logo'
                    alt='BioSeeker Logo'
                />
                {/* <div className="logo-text">
                    <p id='app-name'>BioSeeker</p>
                    <p id='by-team'>By Russtronauts</p>
                </div> */}
            </div>
            
            {/* Center - Navigation Links */}
            <div className='side-bar-routes'>
                <a href="/">Home</a>
                <a href="browse">Browse</a>
                <a href="challenge">Challenge</a>
                <a href="about">About</a>
            </div>
            
            {/* Right corner - Theme Toggle */}
            <div className="theme-toggle-container">
                <ThemeToggle theme={theme} setTheme={setTheme}/>
            </div>
        </div>
    )
}

export default SideBar;