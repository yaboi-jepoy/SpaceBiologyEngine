import React from 'react';
import { useState } from 'react';
import '../styles/NASASearch.css';

export default function LandingPage() {
    return (
        <div className="nasa-search-container">
            <div className="nasa-search-header">
                <p className="nasa-title">NASA Space Biology Knowledge Engine</p>
                <p className="nasa-subtitle">Search across 608+ publications from NASA's OSDR, NSLSL, and Task Book</p>
            </div>
        </div>
    );
}