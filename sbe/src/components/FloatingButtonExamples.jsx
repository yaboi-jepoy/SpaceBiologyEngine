import React from 'react';
import FloatingButton from './floatingButton';
import SearchIcon from '../assets/main_page_icons/search.svg';

// Example component showing different floating button configurations
const FloatingButtonExamples = () => {
    return (
        <div>
            {/* Basic floating button with icon only */}
            <FloatingButton
                icon="🔍"
                onClick={() => console.log('Search clicked')}
                ariaLabel="Search"
                position="bottom-right"
            />

            {/* Floating button with icon and text */}
            <FloatingButton
                icon="➕"
                text="Add New"
                onClick={() => console.log('Add clicked')}
                position="bottom-left"
                variant="success"
            />

            {/* Floating button with image icon */}
            <FloatingButton
                icon={SearchIcon}
                onClick={() => console.log('Image search clicked')}
                position="top-right"
                size="large"
                variant="primary"
            />

            {/* Custom floating button with children */}
            <FloatingButton
                onClick={() => console.log('Custom clicked')}
                position="top-left"
                size="medium"
                variant="warning"
            >
                <span>🎯</span>
            </FloatingButton>

            {/* Multiple buttons stacked */}
            <div style={{ position: 'fixed', bottom: '24px', right: '100px' }}>
                <FloatingButton
                    icon="📊"
                    onClick={() => console.log('Analytics')}
                    variant="secondary"
                    size="small"
                    className="mb-2"
                />
                <FloatingButton
                    icon="⚙️"
                    onClick={() => console.log('Settings')}
                    variant="dark"
                    size="small"
                />
            </div>

            {/* Disabled button */}
            <FloatingButton
                icon="🔒"
                text="Locked"
                onClick={() => console.log('This should not fire')}
                position="bottom-center"
                variant="danger"
                disabled={true}
            />
        </div>
    );
};

export default FloatingButtonExamples;
