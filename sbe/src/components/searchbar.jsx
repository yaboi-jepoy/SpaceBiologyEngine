import { useState } from "react";
import './searchbar.css'
import SearchButton from '../assets/main_page_icons/search.svg';
import AdvancedButton from '../assets/main_page_icons/advanced.svg';

export default function SearchBar() {
    const [searchText, setSearchText] = useState('');
    
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
                />

                {/* Keyword Search Button*/}
                <img onClick={handleSearch} src={SearchButton} className='search-button' alt='Search' />

                {/* Advanced Search Button*/}
                <img src={AdvancedButton} href='' className='advanced-button' />
            </div>
        </div>
    )
}