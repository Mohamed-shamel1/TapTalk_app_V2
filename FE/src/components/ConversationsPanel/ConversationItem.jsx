import React from 'react';
import './ConversationsPanel.css';
const ConversationItem = ({ conversation, isSelected, onSelect }) => {

    const { withUser, lastMessage, unreadCount } = conversation || {};
    const user = withUser || {}; // لتجنب الأخطاء إذا كانت withUser غير موجودة

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);

        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div
            className={`conversation-item ${isSelected ? 'active' : ''}`}
            onClick={onSelect}
        >
            <img
                src={user.profilePicture?.secure_url || `https://ui-avatars.com/api/?name=${user.firstName || '?'}+${user.lastName || '?'}&background=ef7e3a&color=fff`}
                alt={user.firstName || 'User'}
                className="conversation-avatar"
            />
            <div className="conversation-details">
                <div className="conversation-header">
                    <span className="conversation-name">
                        {user.firstName || 'Unknown'} {user.lastName || ''}
                    </span>
                    <span className="conversation-timestamp">
                        {formatTimestamp(lastMessage?.createdAt)}
                    </span>
                </div>
                <div className="conversation-message">
                     {unreadCount > 0 && <span className="unread-dot"></span>}

                    <p className={`last-message-text ${unreadCount > 0 ? 'unread' : ''}`}>
                        {lastMessage?.content || 'No messages yet'}
                    </p>
                    {unreadCount > 0 && (
                        <span className="unread-badge">{unreadCount}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConversationItem;