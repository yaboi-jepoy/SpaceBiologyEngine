import React from 'react';
import { useState } from 'react';
// import '../../styles/NASASearch.css';    // OLD CSS
import '../../styles/pages/LandingPage.css';    // NEW CSS
import blackLogo from '../../assets/app_logos/bioseeker_black.png' ;
import FloatingButton from '../floatingButton';

export default function LandingPage() {
    return (
        <div className="nasa-search-container">
            {/* LOGO */}
            <img src={blackLogo} className='landing-logo'></img>
            {/* TITLE AND SUBTITLE */}
            <div className="nasa-search-header">
                <p className="nasa-title">BioSeeker</p>
                <p className="nasa-subtitle">Search across 608+ publications from NASA's OSDR, NSLSL, and Task Book</p>
            </div>
            {/* SEARCHBAR */}
            <div className="nasa-search-box">
                <input 
                    type="text"
                    placeholder="What's on your mind..."
                    className="nasa-search-input"
                    aria-label='NASA research search'
                    />
            </div>
            {/* PLACEHOLDER FOR HAMBURGER MENU OR FLOATING BUTTON */}
            {/* TO BE DECIDED PA SHA */}
        </div>
    );
}