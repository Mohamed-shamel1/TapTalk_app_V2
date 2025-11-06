import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import LoadingIndicator from '../LoadingIndicator';
import { FaTrash } from 'react-icons/fa';
import './ContactsListModal.css';

const ContactsListModal = ({ onClose, onStartChat }) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    useEffect(() => {
        const fetchFriends = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await userService.getFriends();
                if (response && Array.isArray(response.data.friendes)) {
                    setFriends(response.data.friendes);
                } else {
                    setFriends([]);
                }
            } catch (err) {
                setError('Failed to fetch friends list.');
                console.error("Fetch Friends Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFriends();
    }, []);

    const handleRemoveFriend = async (friendId, e) => {
        e.stopPropagation(); 
        try {
            await userService.removeFriend(friendId);
            setFriends(prevFriends => prevFriends.filter(f => f._id !== friendId));
        } catch (err) {
            alert('Failed to remove friend.');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content contact-list-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>My Contacts ({friends.length})</h3>
                    <button className="modal-close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="modal-body">
                    {loading && <LoadingIndicator height={100} width={100} />}
                    {error && <p className="modal-message error">{error}</p>}
                    
                    {!loading && !error && friends.length === 0 && (
                        <p className="modal-message">Your contact list is empty.</p>
                    )}

                    {!loading && !error && (
                        <div className="contact-list-items">
                            {friends.map(friend => (
                                <div 
                                    className="contact-item" 
                                    key={friend._id}
                                    title={`Click to chat with ${friend.firstName} ${friend.lastName}`}
                                    onClick={() => onStartChat(friend._id)}
                                >
                                    <img 
                                        src={friend.profilePicture?.secure_url || `https://ui-avatars.com/api/?name=${friend.firstName}+${friend.lastName}&background=random`}
                                        alt={friend.firstName}
                                        className="contact-item-avatar"
                                    />
                                    <div className="contact-item-info">
                                        <span className="contact-item-name">
                                            {friend.firstName} {friend.lastName}
                                        </span>
                                        <span className="contact-item-email">{friend.email}</span>
                                    </div>
                                    <button 
                                        className="contact-item-btn remove" 
                                        title="Remove Friend"
                                        onClick={(e) => handleRemoveFriend(friend._id, e)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactsListModal;