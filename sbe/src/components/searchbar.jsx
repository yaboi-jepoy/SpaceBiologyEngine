import { useState } from "react";
import './searchbar.css'
import SearchButton from '../assets/main_page_icons/search.svg';
import AdvancedButton from '../assets/main_page_icons/advanced.svg';

export default function SearchBar() {
    const [searchText, setSearchText] = useState("");
    const { publications, loading } = usePublications(searchText);

    // Only show results if user has typed something
    const term = searchText.trim().toLowerCase();
    const showResults = term.length > 0;

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
                />

                {/* Keyword Search Button*/}
                <img onClick={handleSearch} src={SearchButton} className='search-button' alt='Search' />

                {/* Advanced Search Button*/}
                <img src={AdvancedButton} href='' className='advanced-button' />
            </div>
        </div>
    );
}