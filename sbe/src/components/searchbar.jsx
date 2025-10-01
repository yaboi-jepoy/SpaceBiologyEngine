import { useState } from "react";
import './searchbar.css'
import SearchButton from '../assets/main_page_icons/search.svg';
import AdvancedButton from '../assets/main_page_icons/advanced.svg';
import usePublications from "../hooks/usePublications";

export default function SearchBar() {
    const [searchText, setSearchText] = useState('');
    const { publications, loading } = usePublications(searchText);
    
    // only show results if user has typed something
    const term = searchText.trim().toLowerCase();
    const showResults = term.length > 0;

    const handleSearch = () => {
        alert(`You searched for: ${searchText}`);
    }

    // call function above when Enter is pressed
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }

    // what this component will display
    return (
        <div className='search-container'>
            <div className='search-box'>
                {/* Keyword Search Input*/}
                    <input type="text" 
                    value={searchText} 
                    onChange={(e) => setSearchText(e.target.value)} 
                    onKeyPress={handleKeyPress}
                    placeholder="Enter query or keywords..."
                    className="search-input"
                    autoComplete="off"
                />

                {/* Autocomplete Results below search box */}
                {showResults && (
                    <div className="search-results-dropdown">
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <ul className="search-results-list">
                                {publications.length === 0 ? (
                                    <li className="no-result">No results found</li>
                                ) : (
                                    publications.map((pub, idx) => (
                                        <a
                                            key={idx}
                                            href={pub.Link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="search-result-link"
                                        >
                                            {/* di ko mapagana ilagay sa css ng maayos kaya dito na lng :P */}
                                            <li style={{display: 'flex', alignItems: 'center', padding: '5px 0'}}>
                                                <img src={SearchButton} style={{width: '20px', height: '20px', marginRight: '10px'}} />
                                                {pub.Title}
                                            </li>
                                        </a>
                                    ))
                                )}
                            </ul>
                        )}
                    </div>
                )}

                {/* Keyword Search Button*/}
                <img onClick={handleSearch} src={SearchButton} className='search-button' alt='Search' />

                {/* Advanced Search Button*/}
                <img src={AdvancedButton} href='' className='advanced-button' />
            </div>
        </div>
    )
}