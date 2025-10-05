import React from 'react';
import '../../styles/pages/AboutPage.css';
import SideBar from '../SideBar';
import TeamLogo from '../../assets/teamlogo.png'

const AboutPage = ({ theme, setTheme }) => {
  return (
    <div className="about-container">
        <SideBar theme={theme} setTheme={setTheme} />
        <div className="about-content">
          <div className='about'>
            <h3 className='about-header'>About Us</h3>
            <div className="logo-container">
              <img src={TeamLogo} className="team-logo" alt="Russtronauts Logo" />
            </div>
          </div>
          <div className="about-desc">
            <h1>Russtronauts</h1>
            <h3>
              Silly minds, driving tech forward!
            </h3>
            <p id='para1'>
              We are a group of idealistic students united by a shared passion and love for computer engineering. We strive to develop innovative solutions with our curiosity, collaboration, and creativity, in order to address real-world challenges.
            </p>
            <p id='para2'>
              Proudly representing the Technological Institute of the Philippines – Quezon City, we are committed to showcasing our institution as a hub of intelligent and hardworking students.
            </p>
          </div>
        </div>
    </div>
  )
}

export default AboutPage;