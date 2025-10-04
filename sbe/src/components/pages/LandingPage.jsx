import React from 'react';
import { useState } from 'react';
// import '../../styles/NASASearch.css';    // OLD CSS
import '../../styles/pages/LandingPage.css';    // NEW CSS
import blackLogo from '../../assets/app_logos/bioseeker_black.png' ;
import SearchBar from '../searchBar';
import AiBox from '../aiBox';

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
            <AiBox />
            <SearchBar 
                placeholder="Enter query or keywords..."
                ariaLabel="Search for space biology publications"
                className="landing-searchbar-input  "
            />
            {/* PLACEHOLDER FOR HAMBURGER MENU OR FLOATING BUTTON */}
            {/* TO BE DECIDED PA SHA */}
            {/* OKAY SABI NI ALDOUZE STATIC SIDEBAR NALANG (ACTUAL GOATED OPINION) */}
        </div>
    );
}