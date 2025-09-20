import { useState } from "react";
import './sidebar.css';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    ☰
                </button>

                <div className={`sidebar ${isOpen ? `open` : ''}`}>
                    <h3>Menu</h3>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#resources">Resources</a></li>
                        <li><a href="#about">About</a></li>
                    </ul>
                </div>

                {isOpen && <div className = "sidebar-overlay" onClick={toggleSidebar}></div>}
        </>
    )
}