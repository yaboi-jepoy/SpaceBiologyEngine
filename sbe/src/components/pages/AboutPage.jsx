import React from 'react';
import '../../styles/pages/AboutPage.css';
import SideBar from '../SideBar';

export default function AboutPage() {
  return (
    <div className="about-container">
        <SideBar />
        <div className="about-content">
            <h1 className="about">About</h1>
        </div>
    </div>
  )
}