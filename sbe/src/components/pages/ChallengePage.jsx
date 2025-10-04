import React from 'react';
import '../../styles/pages/ChallengePage.css';
import SideBar from '../SideBar'; // import sidebar

const ChallengePage = ({ theme, setTheme }) => {
  return (
    <div className="challenge-container">
        <SideBar theme={theme} setTheme={setTheme} />
        <div className="challenge-content">
            <h1 className="challenge">Challenge</h1>
        </div>
    </div>
  )
}

export default ChallengePage;