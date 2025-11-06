import React, { useState, useEffect, useRef } from 'react';
import './ChatWindow.css';
import messageService from '../../services/messageService.js';
import userService from '../../services/userService.js';
import LoadingIndicator from '../LoadingIndicator.jsx';
import ChatHeader from './ChatHeader.jsx';
import MessageList from './MessageList.jsx';
import { Send, Paperclip } from 'lucide-react';

const ChatWindow = ({ 
    conversationId, 
    currentUser, 
    messages, 
    setMessages, 
    socket,
    onBackClick, 
    isDarkMode 
    
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otherUser, setOtherUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const fileInputRef = useRef(null);


    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            setError('Please select image files only');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setSelectedFiles(imageFiles);
        const urls = imageFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };


    const handleCancelFiles = () => {
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setSelectedFiles([]);
        setPreviewUrls([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };


    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);


    const handleSendMessage = async () => {
        if ((!newMessage.trim() && selectedFiles.length === 0) || !conversationId || sending) return;

        const messageContent = newMessage.trim();
        const filesToSend = [...selectedFiles];
        
        setNewMessage('');
        handleCancelFiles();
        setSending(true);

        try {
            let messageData;
            
            if (filesToSend.length > 0) {
                const formData = new FormData();
                if (messageContent) {
                    formData.append('content', messageContent);
                }
                filesToSend.forEach(file => {
                    formData.append('images', file);
                });
                messageData = formData;
            } else {
                messageData = { content: messageContent };
            }

            const response = await messageService.sendMessage(conversationId, messageData);
            console.log('Message sent successfully:', response);
        } catch (err) {
            console.error('Failed to send message:', err);
            setNewMessage(messageContent);
            setSelectedFiles(filesToSend);
            setError('Failed to send message.');
            setTimeout(() => setError(''), 3000);
        } finally {
            setSending(false);
        }
    };


    useEffect(() => {
        if (!conversationId || !currentUser) return;

        const fetchMessagesAndUser = async () => {
            setLoading(true);
            setError('');
            setOtherUser(null);
            setMessages([]);
            let fetchedOtherUser = null;

            try {
                console.log('Fetching messages for userId:', conversationId);
                
                try {
                    fetchedOtherUser = await userService.getSharedProfile(conversationId);
                    console.log('User profile fetched:', fetchedOtherUser);
                } catch (userErr) {
                    console.error('Error fetching user profile:', userErr);
                    
                    if (userErr.response && userErr.response.status === 404) {
                        setError('User not found. Please try again.');
                        setLoading(false);
                        return;
                    } else {
                        setError('Failed to load user profile.');
                        setLoading(false);
                        return;
                    }
                }
                
                try {
                    const messagesArray = await messageService.getMessagesWithUser(conversationId);
                    console.log('Messages fetched:', messagesArray);
                    setMessages(messagesArray || []);
                    
                    if (messagesArray && messagesArray.length > 0) {
                        const firstMsg = messagesArray[0];
                        if (firstMsg.senderId && firstMsg.receiverId) {
                            const userFromMessage = firstMsg.senderId._id.toString() === currentUser._id.toString()
                                ? firstMsg.receiverId 
                                : firstMsg.senderId;
                            
                            if (userFromMessage._id.toString() === conversationId.toString()) {
                                fetchedOtherUser = userFromMessage;
                            }
                        }
                    }
                } catch (msgErr) {
                    console.log('No messages found (404) - starting new conversation');
                    if (msgErr.response && msgErr.response.status === 404) {
                        setMessages([]);
                    } else {
                        console.error('Error fetching messages:', msgErr);
                    }
                }
            } catch (err) {
                console.error('Unexpected error:', err);
                setError('Something went wrong. Please try again.');
            } finally {
                setOtherUser(fetchedOtherUser);
                setLoading(false);
            }
        };

        fetchMessagesAndUser();
    }, [conversationId, currentUser?._id]);

    const handleMessageDeleted = (deletedMessageId) => {
        setMessages(prevMessages => prevMessages.filter(msg => msg._id !== deletedMessageId));
    };

    const handleConfirmClearChat = async () => {
         console.log("handleConfirmClearChat triggered ✅");
        try {
            console.log("Deleting conversation:", conversationId);
            await messageService.deleteConversation(conversationId);
            setMessages([]);
        } catch (err) {
            console.error('Error clearing chat:', err);
            setError('Failed to clear chat.');
            setTimeout(() => setError(''), 3000);
        }
    }

    if (!conversationId) {
        return (
            <div className={`chat-window placeholder ${isDarkMode ? 'dark-mode' : ''}`}>
                <h2>Select a chat to start messaging</h2>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={`chat-window placeholder ${isDarkMode ? 'dark-mode' : ''}`}>
                <LoadingIndicator />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`chat-window placeholder error ${isDarkMode ? 'dark-mode' : ''}`}>
                <h2>{error}</h2>
                <button 
                    onClick={() => window.location.reload()}
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Refresh Page
                </button>
            </div>
        );
    }

    if (!otherUser) {
        return (
            <div className={`chat-window placeholder ${isDarkMode ? 'dark-mode' : ''}`}>
                <h2>Loading user information...</h2>
            </div>
        );
    }

    return (
        <div className={`chat-window ${isDarkMode ? 'dark-mode' : ''}`}>
            <ChatHeader 
                otherUser={otherUser} 
                onBackClick={onBackClick}
                onClearChat={handleConfirmClearChat}
                />
            
            <MessageList 
                messages={messages} 
                currentUser={currentUser}
                onDeleteMessage={handleMessageDeleted}

            />
            
            <div className="message-input-container">
                {/* Image Preview Section */}
                {previewUrls.length > 0 && (
                    <div className="image-preview-container">
                        <div className="preview-header">
                            <span>{selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''} selected</span>
                            <button 
                                className="cancel-preview-btn" 
                                onClick={handleCancelFiles}
                                title="Cancel"
                            >
                                X
                            </button>
                        </div>
                        <div className="preview-images">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="preview-image-wrapper">
                                    <img 
                                        src={url} 
                                        alt={`Preview ${index + 1}`} 
                                        className="preview-image"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="message-input-wrapper">
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                    />
                    <button 
                        className="action-btn attachment-btn" 
                        title="Attach image"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={sending}
                    >
                        <Paperclip size={22} />
                    </button>
                    <input
                        type="text"
                        className="message-input"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        disabled={sending}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <button
                        className="send-button"
                        onClick={handleSendMessage}
                        disabled={sending || (!newMessage.trim() && selectedFiles.length === 0)}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;