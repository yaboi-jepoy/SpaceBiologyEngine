// for handling states (ata?)
import { useState } from "react";
import './searchbar.css'

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
        <div className="search-container">
            <input type="text" 
            value={searchText} 
            onChange={(e) => setSearchText(e.target.value)} 
            onKeyPress={handleKeyPress}
            placeholder="Enter query or keywords..."
            className="search-input"/>
            <button onClick={handleSearch} className="search-button">Go</button>
        </div>
    )
}