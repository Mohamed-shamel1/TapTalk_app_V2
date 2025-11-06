import React, { useState, useEffect } from 'react';
import aiService from '../services/aiService.js';
import MessageList from '../components/ChatWindow/MessageList.jsx';
import ChatHeader from '../components/ChatWindow/ChatHeader.jsx';
import LoadingIndicator from '../components/LoadingIndicator.jsx';
import { Send, Bot } from 'lucide-react';
import '../style/AIChatPage.css'; 
import '../components/ChatWindow/ChatWindow.css'; 
import aiimage from '../assets/icons8-happy-robot-assistant-3d-stickle-96.png'
import messageService from '../services/messageService.js';


const AIChatPage = ({ currentUser, socket }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [error, setError] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    


    
    const aiUserObject = {
        _id: 'ai',
        firstName: 'TapTalk',
        lastName: 'AI',
        profilePicture: { secure_url: aiimage },
        status: 'Online 24/7'
    };


     useEffect(() => {
    const loadInitialData = async () => {
      if (!currentUser) return;
      
      setLoadingHistory(true);
      setError('');
      try {
        const history = await aiService.getChatHistory();
        console.log('AI Chat History:', history);
        
        if (history && Array.isArray(history)) {
          const formattedMessages = history.map((item, index) => ({
            _id: `hist_${index}_${Date.now()}`,
            content: item.parts?.[0]?.text || '',
            senderId: item.role === 'user' ? currentUser : aiUserObject,
            receiverId: item.role === 'model' ? currentUser : aiUserObject,
            createdAt: new Date().toISOString(),
            isRead: true
          }));
          setMessages(formattedMessages);
        }
      } catch (err) {
        console.error('Failed to load AI chat history:', err);
        setError("Failed to load chat history.");
      } finally {
        setLoadingHistory(false);
      }
    };
    loadInitialData();
  }, [currentUser]);



     useEffect(() => {
    if (!socket || !currentUser) return;

    console.log('Setting up AI socket listeners...');

    const handleNewAiMessage = ({ reply }) => {
      console.log('AI Reply received:', reply);
      setIsAiTyping(false); 
      
      const aiMsgObject = {
        _id: `ai_${Date.now()}`,
        content: reply,
        senderId: aiUserObject,
        receiverId: currentUser,
        createdAt: new Date().toISOString(),
        isRead: true
      };
      
      setMessages(prev => [...prev, aiMsgObject]); 
    };
    
    const handleAiTyping = () => {
      console.log('AI is typing...');
      setIsAiTyping(true);
    };
    
    const handleAiTypingStop = () => {
      console.log('AI stopped typing');
      setIsAiTyping(false);
    };
    
    const handleAiError = ({ error: errorMsg }) => {
      console.error('AI Error:', errorMsg);
      setIsAiTyping(false);
      setError(errorMsg || 'Something went wrong with AI');
      setTimeout(() => setError(''), 5000);
    };

    socket.on('newAiMessage', handleNewAiMessage);
    socket.on('aiTyping', handleAiTyping);
    socket.on('aiTypingStop', handleAiTypingStop);
    socket.on('aiError', handleAiError);

    return () => {
      socket.off('newAiMessage', handleNewAiMessage);
      socket.off('aiTyping', handleAiTyping);
      socket.off('aiTypingStop', handleAiTypingStop);
      socket.off('aiError', handleAiError);
    };
  }, [socket, currentUser]);


    const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || !currentUser || isAiTyping) {
      console.log('Cannot send message:', { 
        hasMessage: !!newMessage.trim(), 
        hasSocket: !!socket, 
        hasUser: !!currentUser,
        isTyping: isAiTyping 
      });
      return;
    }

    const messageContent = newMessage.trim();
    const userMsgId = `user_${Date.now()}`;

    const userMsgObject = {
      _id: userMsgId,
      content: messageContent,
      senderId: currentUser, 
      receiverId: aiUserObject, 
      createdAt: new Date().toISOString(),
      isRead: true
    };
    
    setMessages(prev => [...prev, userMsgObject]);
    setNewMessage('');

    console.log('Sending AI message via socket:', messageContent);
    socket.emit('aiSendMessage', {
      message: messageContent,
      userId: currentUser._id
    });
  };


    const handleClearAiHistory = async () => {
        console.log('Attempting to clear AI chat history...');
        setError('');
        try {

            await aiService.deleteChatHistory();
            

            setMessages([]); 
            console.log('AI chat history cleared successfully.');

        } catch (err) {
            console.error('Failed to clear AI chat history:', err);
            setError('Failed to clear history. Please try again.');
            setTimeout(() => setError(''), 3000);
        }
    };
    

    if (loadingHistory) {
        return <div className="chat-window placeholder"><LoadingIndicator /></div>;
    }
    

    return (
        <div className="chat-window">
            {/* 4.1 ربطنا الدالة الجديدة بالـ ChatHeader */}
            <ChatHeader 
                otherUser={aiUserObject} 
                onClearChat={handleClearAiHistory} // 👈 الدالة الجديدة هنا
            />
            
            {/* ... (باقي الكود بتاعك: placeholder, MessageList, etc) ... */}
            {messages.length === 0 && !error && (
        <div className="chat-window placeholder ai-welcome">
          <Bot size={100} style={{ color: '#00a884' }} />
          <h2>Hi, I'm TapTalk AI</h2>
          <p>Ask me anything!</p>
        </div>
      )}

      {messages.length > 0 && (
        <MessageList messages={messages} currentUser={currentUser} />
      )}
      
      {isAiTyping && (
        <div className="typing-indicator-container">
          <Bot size={20} className="typing-bot-icon" />
          <span>TapTalk AI is typing...</span>
        </div>
      )}
      
      {error && <p className="chat-error-message">{error}</p>}
            
            {/* ... (كود الـ Message Input زي ما هو) ... */}
            <div className="message-input-container">
        <div className="message-input-wrapper">
          <input
            type="text"
            className="message-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask TapTalk AI anything..."
            disabled={isAiTyping}
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
            disabled={!newMessage.trim() || isAiTyping}
          >
            <Send size={20} />
          </button>
        </div>
      </div>

        </div>
    );
};

export default AIChatPage;