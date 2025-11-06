import React, { useState } from 'react'; // أزل useEffect لأننا مش هنحتاجه
import './ConversationsPanel.css';
import ConversationItem from './ConversationItem.jsx';
import LoadingIndicator from '../LoadingIndicator.jsx';
import { Search ,MessageCircleMore } from 'lucide-react';

const ConversationsPanel = ({ 
    conversations, // استخدم conversations من props بدل ما تجلبها محليًا
    loading, // استخدم loading من props
    error, // استخدم error من props
    selectedConversationId, 
    onSelectConversation, 
    currentUser 
}) => {
    const [searchTerm, setSearchTerm] = useState(''); // ده بس لازم للبحث


    const filteredConversations = conversations.filter(conv =>
        conv.withUser && // تأكد من وجود بيانات المستخدم
        (conv.withUser.firstName + ' ' + conv.withUser.lastName)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="conversations-panel">
            <div className="panel-header">
                <MessageCircleMore className='iconMessage' ></MessageCircleMore>
                <h2>Chats</h2>
                
            </div>
            <div className="search-bar-container">
                <Search className="search-icon" /> 
                <input
                     
                    type="text"
                    placeholder="Search chats..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="conversation-list">
                {error && <p className="error-message">{error}</p>}

                {loading && <LoadingIndicator />}

                {!loading && !error && filteredConversations.length === 0 && (
                    <p className="no-conversations">
                        {searchTerm ? 'No matching chats found.' : 'No conversations yet.'}
                    </p>
                )}

                {!loading && !error && filteredConversations.map(conv => (
                    <ConversationItem
                        key={conv.withUser?._id}
                        conversation={conv}
                        isSelected={conv.withUser?._id === selectedConversationId}
                        onSelect={() => onSelectConversation(conv.withUser?._id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ConversationsPanel;