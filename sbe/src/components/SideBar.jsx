import { useState } from "react";
import '../styles/SideBar.css';
import ThemeToggle from './themetoggle';
import blackLogo from '../assets/app_logos/bioseeker_black.png';
import whiteLogo from '../assets/app_logos/bioseeker_white.png';

const SideBar = ({ theme, setTheme }) => {
    return (
        <div className='side-bar-container'>
            <div className='side-bar-routes'>
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
                {/* LINKS TO PAGES */}
                <a href="/">Home</a>
                <a href="browse">Browse</a>
                <a href="challenge">Challenge</a>
                <a href="about">About</a>
                {/* TOGGLE THEME ICON */}
                <ThemeToggle theme={theme} setTheme={setTheme}/>
            </div>
        </div>
    )
}

export default SideBar;