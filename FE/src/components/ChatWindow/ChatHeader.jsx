import React, { useState, useEffect, useRef } from 'react';
import './ChatWindow.css';
import { FaSearch, FaEllipsisV, FaArrowLeft } from 'react-icons/fa';

const ChatHeader = ({ otherUser, onBackClick, onClearChat }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current && 
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClearChatClick = () => {
        console.log("click clear");
        onClearChat();
        setIsMenuOpen(false);
    };
    
    return (
        <div className="chat-header">
            {onBackClick && (
                <button 
                    className="back-button" 
                    onClick={onBackClick}
                    aria-label="Back to conversations"
                >
                    <FaArrowLeft />
                </button>
            )}
            
            <div className="user-info">
                <img
                    src={
                        otherUser.profilePicture?.secure_url || 
                        `https://ui-avatars.com/api/?name=${otherUser.firstName || '?'}+${otherUser.lastName || '?'}&background=ef7e3a&color=fff`
                    }
                    alt={otherUser.firstName || 'User'}
                    className="chat-avatar"
                />
                <div className="user-details">
                    <span className="user-name">
                        {otherUser.firstName} {otherUser.lastName}
                    </span>
                    <span className="user-status">Online</span>
                </div>
            </div>
            
            <div className="chat-actions">
                <button 
                    className="action-btn search-btn" 
                    aria-label="Search"
                >
                    <FaSearch />
                </button>
                
                <button 
                    ref={buttonRef}
                    className="action-btn menu-btn" 
                    aria-label="More options" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <FaEllipsisV />
                </button>
                
                {isMenuOpen && (
                    <div className="menu" ref={menuRef}>
                        <button className="menu-item" onClick={handleClearChatClick}>
                            Clear Chat
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatHeader;