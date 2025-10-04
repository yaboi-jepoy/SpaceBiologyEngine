// import React, { useState, useEffect } from 'react';
// import '../styles/ThemeToggle.css';
// import LightIcon from '../assets/theme_icons/light_mode.svg';
// import DarkIcon from '../assets/theme_icons/dark_mode.svg';

// const ToggleTheme = ({ theme, setTheme }) => {
//   const toggleTheme = () => {
//     setTheme(prev => prev === 'light' ? 'dark' : 'light');
//   };

//   return (
//     <img
//     onClick={toggleTheme}
//     src={theme === 'light' ? DarkIcon : LightIcon}
//     className='theme-toggle-btn'
//     />
//   )
// }

// export default ToggleTheme;

import React from 'react';
import '../styles/themetoggle.css'
import LightIcon from '../assets/theme_icons/light_mode.svg';
import DarkIcon from '../assets/theme_icons/dark_mode.svg';

const ToggleTheme = ({ theme, setTheme }) => {
  const handleToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <button 
      onClick={handleToggle} 
      className="theme-toggle-btn"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <img 
        src={theme === 'light' ? DarkIcon : LightIcon} 
        alt={`${theme === 'light' ? 'Dark' : 'Light'} mode icon`}
        className="theme-icon"
      />
    </button>
  );
};

export default ToggleTheme;