import React, { useState, useEffect } from 'react';
import './themetoggle.css';
import LightIcon from '../assets/theme_icons/light_mode.svg';
import DarkIcon from '../assets/theme_icons/dark_mode.svg';

const ThemeToggle = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <img onClick={()=>{toggleTheme()}} src={theme === 'light' ? DarkIcon : LightIcon}  className='theme-toggle-btn' />
  )
};

export default ThemeToggle;
