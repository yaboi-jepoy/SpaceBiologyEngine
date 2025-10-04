import React from 'react';
import '../../styles/pages/AboutPage.css';
import SideBar from '../SideBar';

const AboutPage = ({ theme, setTheme }) => {
  return (
    <div className="about-container">
        <SideBar theme={theme} setTheme={setTheme} />
        <div className="about-content">
            <h1 className="about">About</h1>
        </div>
    </div>
  )
}

export default AboutPage;