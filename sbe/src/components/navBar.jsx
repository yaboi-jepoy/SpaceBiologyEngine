import { useState } from "react";
import './navBar.css';
import AppLogoFull from '../assets/app_logos/bioseeker_full_black.png'
import ThemeToggle from './themetoggle';

const NavBar = ({theme, setTheme, activeView, setActiveView}) => {
    return (
        <div className='navbar'>
            {/* Logo - Rear left*/}
            <img src={AppLogoFull} className='team-logo' onClick={() => setActiveView('home')} style={{cursor: 'pointer'}} />

            {/* Options - Center*/}
            <div className='options'>
                <ul>
                    <li><a className={activeView === 'home' ? 'active' : ''} onClick={() => setActiveView('home')}>Home</a></li>
                    <li><a className={activeView === 'nasa' ? 'active' : ''} onClick={() => setActiveView('nasa')}>NASA Search</a></li>
                    <li><a className={activeView === 'browse' ? 'active' : ''} onClick={() => setActiveView('browse')}>Browse</a></li>
                    <li><a className={activeView === 'about' ? 'active' : ''} onClick={() => setActiveView('about')}>About</a></li>
                </ul>
            </div>

            {/* Toggle Mode Button - Rear right */}
            <ThemeToggle theme={theme} setTheme={setTheme}/>
        </div>
    )
}

export default NavBar;