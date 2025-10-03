import { useMemo, useState } from "react";
import '../styles/searchbar.css'
import SearchButton from '../assets/main_page_icons/search.svg';
import ClearIcon from '../assets/main_page_icons/clear.svg';
import useEnhancedPublications from "../hooks/useEnhancedPublications";

// Clean Perplexity AI responses
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\[\d+\]/g, '')
    .replace(/(\[\d+\])+/g, '')
    .replace(/\[\d+-\d+\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/([.,;:!?])([A-Z])/g, '$1 $2');
}

export default function SearchBar({ onSubmitQuery }) {
    const [searchText, setSearchText] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [previewItem, setPreviewItem] = useState(null);
    const [fullContentItem, setFullContentItem] = useState(null);
    const [searchNASA, setSearchNASA] = useState(true); // Toggle NASA search
    // For the home page input, do not call NASA/AI while typing. We'll only
    // compute local suggestions using a minimal call that relies on cached data
    const { 
        publications, 
        enhancedQuery 
    } = useEnhancedPublications(searchText, false, false);
    
    // only show results if user has typed something
    const term = searchText.trim().toLowerCase();
    const showResults = term.length > 0;

    // local autocomplete suggestions based on enhanced terms and current publications
    const suggestions = useMemo(() => {
        const base = new Set();
        if (enhancedQuery) {
            [...(enhancedQuery.keywords||[]), ...(enhancedQuery.scientificTerms||[]), ...(enhancedQuery.tags||[])]
                .filter(Boolean)
                .forEach(k => base.add(String(k)));
        }
        publications.slice(0, 100).forEach(p => {
            if (p.Title) base.add(p.Title);
            if (Array.isArray(p.Tags)) p.Tags.forEach(t => base.add(t));
            if (p.Category) base.add(p.Category);
        });
        const list = Array.from(base);
        if (!term) return list.slice(0, 8);
        return list
            .filter(v => v.toLowerCase().startsWith(term))
            .slice(0, 8);
    }, [enhancedQuery, publications, term]);

    const handleSearch = () => {
        if (onSubmitQuery) onSubmitQuery(searchText);
    }

    // Handle keyboard navigation
    const handleKeyDown = (event) => {
        if (!showResults) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setSelectedIndex(prev => 
                    prev < publications.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                event.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                event.preventDefault();
                if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    setSearchText(suggestions[selectedIndex]);
                    if (onSubmitQuery) onSubmitQuery(suggestions[selectedIndex]);
                } else {
                    if (onSubmitQuery) onSubmitQuery(searchText);
                }
                break;
            case 'Escape':
                setSearchText('');
                setSelectedIndex(-1);
                break;
        }
    };

    const clearSearch = () => {
        setSearchText('');
        setSelectedIndex(-1);
        setPreviewItem(null);
        setFullContentItem(null);
    };


    // what this component will display
    return (
        <div className='search-container'>
            <div className='search-box'>
                {/* Keyword Search Input*/}
                <input 
                    type="text" 
                    value={searchText} 
                    onChange={(e) => setSearchText(e.target.value)} 
                    onKeyDown={handleKeyDown}
                    placeholder="Enter query or keywords..."
                    className="search-input"
                    aria-label="Search for space biology publications"
                    aria-describedby="search-instructions"
                    aria-expanded={showResults}
                    aria-controls="search-results"
                    aria-activedescendant={selectedIndex >= 0 ? `result-${selectedIndex}` : undefined}
                    autoComplete="off"
                    role="combobox"
                />
                {showResults && suggestions.length > 0 && (
                    <ul className="search-suggestions" role="listbox">
                        {suggestions.map((s, i) => (
                            <li
                                key={`sugg-${i}`}
                                role="option"
                                className={i === selectedIndex ? 'active' : ''}
                                onMouseDown={() => setSearchText(s)}
                            >{s}</li>
                        ))}
                    </ul>
                )}
                {searchText && (
                    <img
                        src={ClearIcon}
                        onClick={clearSearch}
                        className="search-clear-btn"
                        aria-label="Clear search"
                    >
                    </img>
                )}
                {/* No results dropdown on home page */}

                {/* Keyword Search Button*/}
                {/* <img onClick={handleSearch} src={SearchButton} className='search-button' alt='Search' /> */}

                {/* Advanced Search Button*/}
                {/* <img src={AdvancedButton} href='' className='advanced-button' /> */}
            </div>

            {/* No preview/full-content modals on home page */}
        </div>
    )
}