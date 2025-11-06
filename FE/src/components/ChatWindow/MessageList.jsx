import React, { useEffect, useRef, useState } from 'react';
import Message from './Message.jsx';
import './ChatWindow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-regular-svg-icons';

const MessageList = ({ messages, currentUser ,onDeleteMessage }) => {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const [userScrolled, setUserScrolled] = useState(false);
    const prevMessageCountRef = useRef(messages.length);

    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
            setUserScrolled(!isAtBottom);
        }
    };

    const scrollToBottom = (smooth = true) => {
        if (messagesEndRef.current && !userScrolled) {
            messagesEndRef.current.scrollIntoView({ 
                behavior: smooth ? "smooth" : "auto" 
            });
        }
    };

    useEffect(() => {
        scrollToBottom(false);
    }, [messages.length > 0 ? messages[0]?._id : null]);

    useEffect(() => {
        const newMessagesAdded = messages.length > prevMessageCountRef.current;
        
        if (newMessagesAdded) {
            const lastMessage = messages[messages.length - 1];

            if (lastMessage?.senderId?._id.toString() === currentUser?._id.toString()) {
                setUserScrolled(false);
                scrollToBottom(true);
            } else if (!userScrolled) {
                scrollToBottom(true);
            }
        }
        
        prevMessageCountRef.current = messages.length;
    }, [messages, currentUser, userScrolled]);

    return (
        <div 
            className="message-list" 
            ref={containerRef}
            onScroll={handleScroll}
        >
            {messages.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    color: '#667781', 
                    marginTop: '50px',
                    fontSize: '40px' 
                }}>
                    there aren't any messages
                    <FontAwesomeIcon icon={faMessage} />
                </div>
            ) : (
                messages.map((msg) => {
                    const isSentByMe = msg.senderId?._id?.toString() === currentUser?._id?.toString();

                    return (
                        <Message
                            key={msg._id}
                            message={msg}
                            isSentByMe={isSentByMe}
                            onDeleteMessage={onDeleteMessage}
                            currentUser={currentUser}
                        />
                    );
                })
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;