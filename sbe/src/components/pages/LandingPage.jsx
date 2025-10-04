import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/LandingPage.css';    // NEW CSS
import SideBar from '../SideBar'; // import sidebar
import blackLogo from '../../assets/app_logos/bioseeker_black.png';
import whiteLogo from '../../assets/app_logos/bioseeker_white.png';
import SearchBar from '../searchBar'
import useEnhancedSearch from '../../hooks/useEnhancedSearch';
import usePublications from '../../hooks/usePublications'

const LandingPage = ({ theme, setTheme }) => {

  const navigate = useNavigate();

  // get the publications from Firestore
  const { publications, loading: loadingPubs } = usePublications();

  // search book
  const {
    query,
    setQuery,
    performSearch,
    loading
  } = useEnhancedSearch(publications);

  // search submission
  const handleSearch = async (searchQuery) => {
    // do the search
    await performSearch(searchQuery);

    // goto results
    navigate('/results', {state : {query: searchQuery}});
  }

  return (
    <div className={`nasa-search-container`}>
      {/* SIDEBAR */}
      <SideBar theme={theme} setTheme={setTheme} />
      <div id='main-page'>
        {/* LOGO */}
        <img
        src={theme === 'light' ? blackLogo : whiteLogo}
        className='landing-logo'
        alt='BioSeeker Logo'
        />
        {/* TITLE AND SUBTITLE */}
        <div className="nasa-search-header">
          <h1 className="nasa-title">BioSeeker</h1>
          <p className="nasa-subtitle">Your space biology searcher tool!</p>
        </div>

        {/* SEARCHBAR */}
        {loadingPubs ? (<p>Loading publications...</p>
        ): (
          <SearchBar theme={theme} setTheme={setTheme} 
            query={query}
            onQueryChange={setQuery}
            onSearch={handleSearch}
            ariaLabel={"Search space biology publications"}
            placeholder={"Search the NASA Biology Database..."}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

export default LandingPage;