import React, { useState, useEffect } from 'react';
import '../styles/ThemeToggle.css';
import LightIcon from '../assets/theme_icons/light_mode.svg';
import DarkIcon from '../assets/theme_icons/dark_mode.svg';

export default function ThemeToggle() {
  return (
    <img onClick={()=>{handleTheme()}} src={theme === 'light' ? DarkIcon : LightIcon}  className='theme-toggle-btn' />
  )
}
