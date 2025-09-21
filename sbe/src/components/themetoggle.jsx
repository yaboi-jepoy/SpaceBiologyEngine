import React, { useState, useEffect } from 'react';
import './themetoggle.css';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button className="theme-toggle-btn" onClick={toggleTheme}>
      {theme === 'light' ? '🌞 Light Mode' : '🌜 Dark Mode'}
    </button>
  );
};

export default ThemeToggle;
