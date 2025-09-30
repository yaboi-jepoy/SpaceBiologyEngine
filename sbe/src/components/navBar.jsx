import { useState } from "react";
import './navBar.css';
import TeamLogo from '../assets/teamlogo.png';
import ThemeToggle from './themetoggle';

const NavBar = ({theme, setTheme}) => {
    return (
        <div className='navbar'>
            {/* Logo - Rear left*/}
            <img src={TeamLogo} className='team-logo' />

            {/* Options - Center*/}
            <ul>
                <li><a>Home</a></li>
                <li><a>Resources</a></li>
                <li><a>About</a></li>
                <li><a>Contact Us</a></li>
            </ul>

            {/* Toggle Mode Button - Rear right */}
            <ThemeToggle theme={theme} setTheme={setTheme}/>
        </div>
    )
}

export default NavBar;