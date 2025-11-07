import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import NavSidebar from '../components/NavSidebar/NavSidebar.jsx';
import ConversationsPanel from '../components/ConversationsPanel/ConversationsPanel.jsx';
import ChatWindow from '../components/ChatWindow/ChatWindow.jsx';
import AIChatPage from './AIChatPage.jsx';
import ContactsListModal from '../components/ContactsListModal/ContactsListModal.jsx';
import '../style/DashboardLayout.css';
import SettingsPage from '../components/settinges/SettingsPage.jsx';
import userService from '../services/userService.js';
import messageService from '../services/messageService.js';
import LoadingIndicator from '../components/LoadingIndicator.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { FaCommentDots, FaAddressBook, FaCog } from 'react-icons/fa';
import robotIcon from '../assets/icons8-happy-robot-assistant-3d-stickle-96.png';
import { SOCKET_URL } from '../../config.js';

const SOCKET_SERVER_URL = SOCKET_URL;

const DashboardLayout = () => {
    const { isDarkMode } = useTheme();
    const [currentUser, setCurrentUser] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [error, setError] = useState('');
    const [activeView, setActiveView] = useState('chats');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [conversationError, setConversationError] = useState('');
    const [messages, setMessages] = useState([]);
    
    const [showContactsModal, setShowContactsModal] = useState(false);
    
    const socketRef = useRef(null);


    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    useEffect(() => {
        const fetchProfile = async () => {
            setLoadingProfile(true); 
            setError('');
            try {
                const response = await userService.getUserProfile();
                if (response && response.data && response.data.user) {
                    setCurrentUser(response.data.user);
                } else {
                    setError('Failed to process profile data.');
                }
            } catch (err) {
                console.error("Fetch Profile Error:", err);
                setError('Failed to fetch user profile.');
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchProfile();
    }, []);


    useEffect(() => {
        if (currentUser?._id) { 
            const fetchConversations = async () => {
                setLoadingConversations(true);
                setConversationError('');
                try {
                    const responseData = await messageService.getConversations(); 
                    if (responseData && responseData.data && Array.isArray(responseData.data.conversations)) {
                       setConversations(responseData.data.conversations);
                    } else {
                       setConversationError('Could not load conversations.');
                    }
                } catch (err) {
                    setConversationError('Failed to fetch conversations.');
                } finally {
                    setLoadingConversations(false);
                }
            };
            fetchConversations();
        } else {
             setLoadingConversations(false);
        }
    }, [currentUser]);


    useEffect(() => {
        if (currentUser?._id) {
            const newSocket = io(SOCKET_SERVER_URL, {
                auth: { token: localStorage.getItem('token') } 
            });
            socketRef.current = newSocket;

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
                newSocket.emit('joinRoom', currentUser._id);
            });
            newSocket.on('connect_error', (err) => { 
                console.error('Socket connection error:', err); 
                setError('Chat connection failed.'); 
            });
            newSocket.on('disconnect', (reason) => { 
                console.log('Socket disconnected:', reason); 
            });

            newSocket.on('newMassage', ({ massage }) => {
                console.log('--- Socket: New message received ---:', massage);
                
                const currentUserIdStr = currentUser._id.toString();
                const senderIdStr = massage.senderId._id.toString();
                const receiverIdStr = massage.receiverId._id.toString();
                const isCurrentUserSender = senderIdStr === currentUserIdStr;
                const otherUserIdStr = isCurrentUserSender ? receiverIdStr : senderIdStr;

                setConversations(prevConvs => {
                    const oldConv = prevConvs.find(c => c.withUser?._id.toString() === otherUserIdStr);
                    const oldUnreadCount = oldConv?.unreadCount || 0;
                    let updatedConvs = prevConvs.filter(c => c.withUser?._id.toString() !== otherUserIdStr);

                    const newOrUpdatedConv = {
                        withUser: isCurrentUserSender ? massage.receiverId : massage.senderId,
                        lastMessage: { content: massage.content, createdAt: massage.createdAt },
                        unreadCount: (!isCurrentUserSender && otherUserIdStr !== selectedConversationId?.toString()) 
                                        ? oldUnreadCount + 1 
                                        : (oldConv?.unreadCount || 0)
                    };
                    if (selectedConversationId?.toString() === otherUserIdStr) {
                        newOrUpdatedConv.unreadCount = 0;
                    }
                    return [newOrUpdatedConv, ...updatedConvs];
                });

                if (selectedConversationId?.toString() === otherUserIdStr) {
                    setMessages(prevMessages => {
                        const messageExists = prevMessages.some(msg => 
                            msg._id === massage._id || 
                            (msg.content === massage.content && 
                             Math.abs(new Date(msg.createdAt) - new Date(massage.createdAt)) < 1000)
                        );
                        
                        if (messageExists) {
                            console.log('Message already exists, skipping...');
                            return prevMessages;
                        }
                        
                        return [...prevMessages, massage];
                    });
                }
            });

            newSocket.on('messages_updated_to_read', ({ messageIds }) => {
                 console.log('--- Socket: Messages updated to read ---:', messageIds);
                 setMessages(prevMessages =>
                     prevMessages.map(msg =>
                         messageIds.includes(msg._id) ? { ...msg, isRead: true } : msg
                     )
                 );
            });

            return () => { 
                newSocket.disconnect(); 
                socketRef.current = null; 
            };
        }
    }, [currentUser, selectedConversationId]);

    const handleSelectConversation = (userId) => {
        setSelectedConversationId(userId);
        setActiveView('chats');
        
        setConversations(prevConvs =>
            prevConvs.map(conv =>
                conv.withUser?._id === userId ? { ...conv, unreadCount: 0 } : conv
            )
        );
        setMessages([]);
    };

    const handleUserUpdate = (updatedUser) => { setCurrentUser(updatedUser); };
    
    const handleChangeView = (view) => {
        if (view === 'contacts') {
            setShowContactsModal(true);
        } else {
            setActiveView(view);
            setSelectedConversationId(null);
        }
    };

    const handleContactsModalClose = (userId) => {
        setShowContactsModal(false);
        if (userId) {
            handleSelectConversation(userId);
            setActiveView('chats');
        }
    };

    const handleBackClick = () => {
        setSelectedConversationId(null);
    };

    if (loadingProfile || loadingConversations) {
        return (
            <div className="loading-full-page">
                <LoadingIndicator width={300} height={400} />
            </div>
        );
    }
    
    if (error) { 
        return <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>{error}</div>; 
    }
    if (!currentUser) { 
        return <div style={{ color: 'orange', padding: '20px', textAlign: 'center' }}>User data could not be loaded.</div>; 
    }


    const isChatActive = isMobile && selectedConversationId && activeView === 'chats';

    if (!isMobile) {

        return (
            <div className="dashboard-layout">
                <NavSidebar 
                    user={currentUser} 
                    currentView={activeView}
                    onChangeView={handleChangeView}
                />
                
                <ConversationsPanel
                    className="conversations-panel"
                    conversations={conversations}
                    loading={loadingConversations}
                    error={conversationError}
                    selectedConversationId={selectedConversationId}
                    onSelectConversation={handleSelectConversation}
                    currentUser={currentUser}
                />

                {activeView === 'chats' && (
                    <ChatWindow
                        className="chat-window"
                        conversationId={selectedConversationId}
                        currentUser={currentUser}
                        messages={messages}
                        setMessages={setMessages}
                        socket={socketRef.current}
                        onBackClick={null}
                        isDarkMode={isDarkMode}
                    />
                )}
                
                {activeView === 'ai-chat' && (
                    <AIChatPage 
                        className="ai-chat-page"
                        currentUser={currentUser} 
                        socket={socketRef.current}
                    />
                )}
                
                {activeView === 'settings' && (
                     <SettingsPage 
                        className="settings-page"
                        currentUser={currentUser}
                        onUserUpdate={handleUserUpdate}
                    />
                )}
                
                {showContactsModal && (
                    <ContactsListModal 
                        onClose={() => setShowContactsModal(false)}
                        currentUser={currentUser}
                        onStartChat={handleContactsModalClose}
                    />
                )}

                <div className="bottom-nav">
                    <button 
                        className={`bottom-nav-item ${activeView === 'chats' ? 'active' : ''}`}
                        onClick={() => handleChangeView('chats')}
                    >
                        <FaCommentDots />
                        <span>Chats</span>
                    </button>
                    
                    <button 
                        className={`bottom-nav-item ${activeView === 'contacts' ? 'active' : ''}`}
                        onClick={() => handleChangeView('contacts')}
                    >
                        <FaAddressBook />
                        <span>Contacts</span>
                    </button>

                    <button 
                        className={`bottom-nav-item ${activeView === 'ai-chat' ? 'active' : ''}`}
                        onClick={() => handleChangeView('ai-chat')}
                    >
                        <img src={robotIcon} alt="AI" />
                        <span>AI Chat</span>
                    </button>
                    
                    <button 
                        className={`bottom-nav-item ${activeView === 'settings' ? 'active' : ''}`}
                        onClick={() => handleChangeView('settings')}
                    >
                        <FaCog />
                        <span>Settings</span>
                    </button>
                </div>
            </div>
        );
    } else {

        return (
            <div className={`dashboard-layout ${isChatActive ? 'chat-active' : ''}`}>
                {activeView === 'chats' && selectedConversationId ? (
                    <ChatWindow
                        className="chat-window"
                        conversationId={selectedConversationId}
                        currentUser={currentUser}
                        messages={messages}
                        setMessages={setMessages}
                        socket={socketRef.current}
                        onBackClick={handleBackClick}
                        isDarkMode={isDarkMode}
                    />
                ) : activeView === 'chats' ? (
                    <ConversationsPanel
                        className="conversations-panel"
                        conversations={conversations}
                        loading={loadingConversations}
                        error={conversationError}
                        selectedConversationId={selectedConversationId}
                        onSelectConversation={handleSelectConversation}
                        currentUser={currentUser}
                    />
                ) : activeView === 'settings' ? (
                    <SettingsPage 
                        className="settings-page"
                        currentUser={currentUser}
                        onUserUpdate={handleUserUpdate}
                    />
                ) : activeView === 'ai-chat' ? (
                    <AIChatPage 
                        className="ai-chat-page"
                        currentUser={currentUser} 
                        socket={socketRef.current}
                    />
                ) : null}
                
                {showContactsModal && (
                    <ContactsListModal 
                        onClose={() => setShowContactsModal(false)}
                        currentUser={currentUser}
                        onStartChat={handleContactsModalClose}
                    />
                )}

                {/* ✅ إخفاء Bottom Nav لما يكون في chat مفتوح */}
                {!isChatActive && (
                    <div className="bottom-nav">
                        <button 
                            className={`bottom-nav-item ${activeView === 'chats' ? 'active' : ''}`}
                            onClick={() => handleChangeView('chats')}
                        >
                            <FaCommentDots />
                            <span>Chats</span>
                        </button>
                        
                        <button 
                            className={`bottom-nav-item ${activeView === 'contacts' ? 'active' : ''}`}
                            onClick={() => handleChangeView('contacts')}
                        >
                            <FaAddressBook />
                            <span>Contacts</span>
                        </button>

                        <button 
                            className={`bottom-nav-item ${activeView === 'ai-chat' ? 'active' : ''}`}
                            onClick={() => handleChangeView('ai-chat')}
                        >
                            <img src={robotIcon} alt="AI" />
                            <span>AI Chat</span>
                        </button>
                        
                        <button 
                            className={`bottom-nav-item ${activeView === 'settings' ? 'active' : ''}`}
                            onClick={() => handleChangeView('settings')}
                        >
                            <FaCog />
                            <span>Settings</span>
                        </button>
                    </div>
                )}
            </div>
        );
    }
};

export default DashboardLayout;