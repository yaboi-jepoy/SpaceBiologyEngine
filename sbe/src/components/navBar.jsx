import { useState } from "react";
import './navBar.css';
import LogoWhite from '../assets/app_logo/bioseeker_full_white.png';
import ThemeToggle from './themetoggle';

const NavBar = ({theme, setTheme}) => {
    return (
        <div className='navbar'>
            {/* Logo - Rear left*/}
            <img src={LogoWhite} className='team-logo' />

            {/* Options - Center*/}
            <ul>
                <li><a>Home</a></li>
                <li><a>Browse</a></li>
                <li><a>About</a></li>
                <li><a>Contact Us</a></li>
            </ul>

            {/* Toggle Mode Button - Rear right */}
            <ThemeToggle theme={theme} setTheme={setTheme}/>
        </div>
    )
}

export default NavBar;