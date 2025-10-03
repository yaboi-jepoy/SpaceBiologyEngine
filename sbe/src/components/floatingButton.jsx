import React from "react";
import '../styles/floatingButton.css';

const FloatingButton = ({ 
    onClick, 
    icon, 
    text, 
    position = 'bottom-right', 
    size = 'medium',
    variant = 'primary',
    ariaLabel,
    disabled = false,
    className = '',
    children
}) => {
    // Generate position classes
    const positionClass = `floating-btn-${position}`;
    
    // Generate size classes
    const sizeClass = `floating-btn-${size}`;
    
    // Generate variant classes
    const variantClass = `floating-btn-${variant}`;
    
    // Combine all classes
    const buttonClasses = [
        'floating-button',
        positionClass,
        sizeClass,
        variantClass,
        disabled ? 'floating-btn-disabled' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button 
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel || text || 'Floating action button'}
            title={text}
        >
            {/* Icon */}
            {icon && (
                <span className="floating-btn-icon">
                    {typeof icon === 'string' ? (
                        <img src={icon} alt="" />
                    ) : (
                        icon
                    )}
                </span>
            )}
            
            {/* Text */}
            {text && (
                <span className="floating-btn-text">{text}</span>
            )}
            
            {/* Custom children */}
            {children}
        </button>
    );
};

export default FloatingButton;