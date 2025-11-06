import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavSidebar.css';
import logo from '../../assets/Logo-removebg-preview.png';
import robotIcon from '../../assets/icons8-happy-robot-assistant-3d-stickle-96.png';
import { FaSignOutAlt, FaCog, FaCommentDots, FaAddressBook, FaPlus } from 'react-icons/fa';
import userService from '../../services/userService.js';

const NavSidebar = ({ user, currentView, onChangeView }) => {
    const navigate = useNavigate();
    const [showAddContactModal, setShowAddContactModal] = useState(false);
    const [contactEmail, setContactEmail] = useState('');

    const [modalLoading, setModalLoading] = useState(false);
    const [modalError, setModalError] = useState('');
    const [modalSuccess, setModalSuccess] = useState('');

    const handleLogout = async () => {
        try { 
            await userService.logout(); 
        } catch (error) { 
            console.error("Logout failed", error); 
        } finally {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };
    
    const getNavItemClass = (viewName) => {
        return `nav-item ${currentView === viewName ? 'active' : ''}`;
    };

    const closeModal = () => {
        setShowAddContactModal(false);
        setContactEmail('');
        setModalLoading(false);
        setModalError('');
        setModalSuccess('');
    };

    const handleAddContact = async () => {
        if (!contactEmail.trim()) {
            setModalError('Please enter an email address');
            return;
        }
        
        setModalLoading(true);
        setModalError('');
        setModalSuccess('');
        
        try {
            const response = await userService.addFriend(contactEmail);
            
            setModalSuccess(response.message || 'Friend added successfully!');
            setContactEmail(''); // تفريغ الحقل
            
            setTimeout(() => {
                closeModal();
            }, 2000);

        } catch (error) {
            console.error('Failed to add contact:', error);
            setModalError(error.response?.data?.message || 'Failed to add contact. Please try again.');
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <>
            <div className="nav-sidebar">
                <div className="sidebar-top">
                    <div className="nav-header">
                        <img src={logo} alt="Logo" className="nav-logo" />
                    </div>

                    <nav className="nav-links">
                        <button 
                            className={getNavItemClass('chats')} 
                            title="Chats" 
                            onClick={() => onChangeView('chats')}
                        >
                            <FaCommentDots />
                        </button>
                        
                      

                        <button 
                            className={getNavItemClass('contacts')} 
                            title="Contacts" 
                            onClick={() => onChangeView('contacts')}
                        >
                            <FaAddressBook />
                        </button>

                        <button 
                            className={getNavItemClass('settings')} 
                            title="Settings" 
                            onClick={() => onChangeView('settings')}
                        >
                            <FaCog />
                        </button>
                        <span className="nav-divider"></span>
                          <button 
                            className={getNavItemClass('ai-chat')} 
                            title="AI Chat" 
                            onClick={() => onChangeView('ai-chat')}
                        >
                            <img src={robotIcon} alt="AI Bot" className="nav-icon-image" />
                        </button>
                    </nav>
                    
                    <button 
                        className="new-chat-btn" 
                        title="Add Contact"
                        onClick={() => setShowAddContactModal(true)} // فتح المودال
                    >
                        <FaPlus />
                    </button>
                </div>

                <div className="nav-footer">
                    {user && (
                        <div className="profile-section">
                            <img 
                                src={user.profilePicture?.secure_url || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`} 
                                alt="User Profile" 
                                className="profile-avatar"
                                title={`${user.firstName} ${user.lastName}`}
                            />
                            <button onClick={handleLogout} className="logout-icon" title="Logout">
                                <FaSignOutAlt />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- ✅ 4. تحديث المودال --- */}
            {showAddContactModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Add New Contact</h3>
                            <button 
                                className="modal-close-btn"
                                onClick={closeModal}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            
                            {/* عرض رسائل الخطأ والنجاح */}
                            {modalError && <p className="modal-message error">{modalError}</p>}
                            {modalSuccess && <p className="modal-message success">{modalSuccess}</p>}

                            <input
                                type="email"
                                className="modal-input"
                                placeholder="Enter contact's email"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                disabled={modalLoading} // تعطيل الحقل أثناء التحميل
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !modalLoading) {
                                        handleAddContact();
                                    }
                                }}
                            />
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="modal-btn cancel"
                                onClick={closeModal}
                                disabled={modalLoading} // تعطيل الزر
                            >
                                Cancel
                            </button>
                            <button 
                                className="modal-btn add"
                                onClick={handleAddContact}
                                disabled={modalLoading} // تعطيل الزر
                            >
                                {modalLoading ? 'Adding...' : 'Add Contact'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NavSidebar;