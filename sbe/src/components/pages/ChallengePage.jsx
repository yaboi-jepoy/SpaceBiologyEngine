import React from 'react';
import '../../styles/pages/ChallengePage.css';
import SideBar from '../SideBar';

export default function ChallengePage() {
  return (
    <div className="challenge-container">
        <SideBar />
        <div className="challenge-content">
            <h1 className="challenge">Challenge</h1>
        </div>
    </div>
  )
}