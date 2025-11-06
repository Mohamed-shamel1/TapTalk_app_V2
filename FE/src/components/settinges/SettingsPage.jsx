import React, { useState, useRef } from 'react';
import { FaCamera, FaSave, FaSignOutAlt, FaLock, FaTrash, FaUndo, FaCameraRetro, FaPen } from 'react-icons/fa';
import userService from '../../services/userService.js';
import { SaveLoader } from '../LoadingIndicator.jsx';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import './SettingsPage.css';

const SettingsPage = ({ currentUser, onUserUpdate }) => {
    const [user, setUser] = useState(currentUser);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });


    const [profileData, setProfileData] = useState({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        phone: currentUser.phone || '',
        gender: currentUser.gender || 'male'
    });


    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });


    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme') === 'dark'
    );


    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState('Are you sure you want to proceed with this action?');

    const fileInputRef = useRef(null);


    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    };


    const handleProfilePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        try {
            const response = await userService.uploadProfilePicture(file);

            if (response.data?.data?.user) {
                const updatedUser = response.data.data.user;
                setUser(updatedUser);
                if (onUserUpdate) onUserUpdate(updatedUser);
                showMessage('Profile picture updated successfully!');
            } else {
                showMessage('Failed to update picture (invalid response).', 'error');
            }
        } catch (err) {
            console.error("Upload Picture Error:", err);
            showMessage(err.response?.data?.message || 'Failed to upload profile picture', 'error');
        } finally {
            setLoading(false);
        }
    };


    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await userService.updateProfile(profileData);
            if (response && response.data && response.data.user) {
                const updatedUser = response.data.user;
                setUser(updatedUser);
                if (onUserUpdate) onUserUpdate(updatedUser);
                showMessage('Profile updated successfully!');
            }
        } catch (err) {
            console.error("Update Profile Error:", err);
            showMessage(err.response?.data?.message || 'Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };


    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showMessage('New passwords do not match', 'error');
            return;
        }
        setLoading(true);
        try {
            await userService.updatePassword(passwordData);
            showMessage('Password changed successfully!');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error("Password Change Error:", err);
            showMessage(err.response?.data?.message || 'Failed to change password', 'error');
        } finally {
            setLoading(false);
        }
    };


    const handleLogout = async () => {
        setLoading(true);
        try {

            
            showMessage('Logout successful!');
            localStorage.removeItem('token');
            window.location.href = '/login';
        } catch (err) {
            showMessage('Logout failed', 'error');
            setLoading(false);
        }
    };


    const handleFreezeAccount = async () => {
        setLoading(true);
        try {
            await userService.freezeAccount();
            showMessage('Account frozen successfully!');
            setTimeout(() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }, 2000);
        } catch (err) {
            showMessage('Failed to freeze account', 'error');
            setLoading(false);
        }
    };


    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            await userService.deleteAccount(user._id);
            showMessage('Account deleted successfully!');
            setTimeout(() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }, 6000);
        } catch (err) {
            showMessage('Failed to delete account', 'error');
            setLoading(false);
        }
    };


    const openConfirmDialog = (action, messageText) => {
        setConfirmAction(action);
        setConfirmMessage(messageText || 'Are you sure you want to proceed with this action?');
        setShowConfirmDialog(true);
    };


    const executeConfirmedAction = () => {
        setShowConfirmDialog(false);
        if (confirmAction) confirmAction();
        setConfirmAction(null);
    };


    const toggleTheme = () => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        setIsDarkMode(!isDarkMode);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };
    console.log(profileData)

    return (
        <div className={`settings-page ${isDarkMode ? 'dark-mode' : ''}`}>
            {loading && (
                <div className="settings-loading-overlay">
                    <SaveLoader width={80} height={80} />
                </div>
            )}

            <div className="settings-header">
                <h1>Settings</h1>
            </div>

            {message.text && (
                <div className={`settings-message ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="settings-content">
                <section className="settings-section">
                    <h2 className="section-title">Account Info</h2>

                    <div className="profile-picture-section">
                        <div className="profile-picture-wrapper">
                            <img
                                src={user.profilePicture?.secure_url || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
                                alt="Profile"
                                className="profile-picture-large"
                            />
                            <button
                                className="change-picture-btn"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading}
                            >
                                <FontAwesomeIcon icon={faCamera} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleProfilePictureUpload}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </div>

                        <div className="profile-fields">
                            <div className="field-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={profileData.firstName}
                                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                />
                            </div>

                            <div className="field-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={profileData.lastName}
                                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                />
                            </div>

                            <div className="field-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                />
                            </div>

                            <div className="field-group">
                                <label>Gender</label>
                                <select
                                    value={profileData.gender}
                                    onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <button
                                className="btn-primary"
                                onClick={handleProfileUpdate}
                                disabled={loading}
                            >
                                <FaSave /> Save Changes
                            </button>
                        </div>
                    </div>
                </section>

                <section className="settings-section">
                    <h2 className="section-title">Security</h2>

                    <div className="password-change-section">
                        <div className="field-group">
                            <label>Old Password</label>
                            <input
                                type="password"
                                value={passwordData.oldPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                placeholder="Enter old password"
                            />
                        </div>

                        <div className="field-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                placeholder="Enter new password"
                            />
                        </div>

                        <div className="field-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                placeholder="Confirm new password"
                            />
                        </div>

                        <button
                            className="btn-primary"
                            onClick={handlePasswordChange}
                            disabled={loading}
                        >
                            <FaLock /> Change Password
                        </button>
                    </div>

                    <div className="logout-section">
                        <button
                            className="btn-secondary"
                            onClick={() => handleLogout(false)}
                            disabled={loading}

                        >
                            <FaSignOutAlt /> Logout from this device
                        </button>
                    </div>
                </section>

                <section className="settings-section">
                    <h2 className="section-title">Privacy</h2>

                    <button
                        className="btn-warning"
                        onClick={() => openConfirmDialog(
                            handleFreezeAccount,
                            "If you freeze your account, you will not be able to restore it unless you contact the administrator."
                        )}
                        disabled={loading}
                    >
                        <FaLock /> Freeze Account
                    </button>
                </section>

                {/* Danger Zone */}
                <section className="settings-section danger-zone">
                    <h2 className="section-title">Danger Zone</h2>

                    <button
                        className="btn-danger"
                        onClick={() => openConfirmDialog(
                            handleDeleteAccount,
                            "Are you sure you want to permanently delete your account? This action cannot be undone."
                        )}
                        disabled={loading}
                    >
                        <FaTrash /> Delete Account Permanently
                    </button>
                </section>

<section className="settings-section">
                    <h2 className="section-title">Appearance</h2>
                    
                    <div className="theme-toggle-section">
                        <label htmlFor="theme-toggle-input">Dark Mode</label>
                        
                        {/* --- كود الـ Toggle الجديد --- */}
                        <label className="switch" htmlFor="theme-toggle-input">
                            <input 
                                id="theme-toggle-input" 
                                type="checkbox" 
                                checked={isDarkMode}
                                onChange={toggleTheme}
                            />
                            <div className="slider round">
                                <div className="sun-moon">
                                    {/* (SVGs للنقاط على القمر) */}
                                    <svg id="moon-dot-1" className="moon-dot" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="moon-dot-2" className="moon-dot" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="moon-dot-3" className="moon-dot" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    
                                    {/* (SVGs لأشعة الشمس) */}
                                    <svg id="light-ray-1" className="light-ray" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="light-ray-2" className="light-ray" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="light-ray-3" className="light-ray" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>

                                    {/* (SVGs للسحب) */}
                                    <svg id="cloud-1" className="cloud-dark" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="cloud-2" className="cloud-dark" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="cloud-3" className="cloud-dark" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="cloud-4" className="cloud-light" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="cloud-5" className="cloud-light" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                    <svg id="cloud-6" className="cloud-light" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="50"></circle>
                                    </svg>
                                </div>
                                <div className="stars">
                                    {/* (SVGs للنجوم) */}
                                    <svg id="star-1" className="star" viewBox="0 0 20 20">
                                        <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                                    </svg>
                                    <svg id="star-2" className="star" viewBox="0 0 20 20">
                                        <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                                    </svg>
                                    <svg id="star-3" className="star" viewBox="0 0 20 20">
                                        <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                                    </svg>
                                    <svg id="star-4" className="star" viewBox="0 0 20 20">
                                        <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                                    </svg>
                                </div>
                            </div>
                        </label>
                        {/* --- نهاية كود الـ Toggle الجديد --- */}

                    </div>
                </section>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="modal-overlay" onClick={() => setShowConfirmDialog(false)}>
                    <div className="modal-content confirm-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="confirm-message">
                            <p>{confirmMessage}</p>
                        </div>
                        <div className="confirm-buttons">
                            <button className="confirm-btn yes-btn" onClick={executeConfirmedAction}>
                                Yes
                            </button>
                            <button className="confirm-btn no-btn" onClick={() => setShowConfirmDialog(false)}>
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
