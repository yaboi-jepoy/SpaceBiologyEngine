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
import '../styles/ThemeToggle.css';
import LightIcon from '../assets/theme_icons/light_mode.svg';
import DarkIcon from '../assets/theme_icons/dark_mode.svg';

const ToggleTheme = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    // <img
    //   onClick={() => {toggleTheme()}}
    //   src={theme === 'light' ? DarkIcon : LightIcon}
    //   className='theme-toggle-btn'
    // />
    <button onClick={toggleTheme}>
      {theme === 'light' ? "Switch to Dark" : "Switch to Light"}
    </button>
  );
};

export default ToggleTheme;