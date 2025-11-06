import React, { useEffect, useRef, useState } from 'react';
import './ChatWindow.css';
import { Check, CheckCheck , MoreVertical, Trash2} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import messageService from '../../services/messageService.js';

const Message = ({ message, isSentByMe , onDeleteMessage }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleOptionsClick = () => {
        setShowOptions(!showOptions);
    };
    
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString('EG', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const handleDownload = async (imageUrl, index) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `image_${index + 1}_${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const handleDelete = async () => {
       if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                await messageService.deleteMessage(message._id);
                if (onDeleteMessage) {
                    onDeleteMessage(message._id);
                }
            } catch (error) {
                console.error("Failed to delete message:", error);
                alert("Failed to delete message. Only the sender can delete a message.");
            }
        }
        setShowOptions(false);
    };

    const hasAttachments = message.attachments && message.attachments.length > 0;
    const hasContent = message.content && message.content.trim() !== '';

    return (
        <>
            <div className={`message-container ${isSentByMe ? 'sent' : 'received'}`}>
                <div className={`message-bubble ${isSentByMe ? 'sent-bubble' : 'received-bubble'}`}>

                    {/* ✅ 7. إضافة زر الخيارات (الـ 3 نقط) */}
                    {isSentByMe && (
                        <div className="message-options-wrapper">
                            <button 
                                ref={buttonRef}
                                className="message-options-btn" 
                                onClick={handleOptionsClick}
                                title="Message options"
                            >
                                <MoreVertical size={14} />
                            </button>
                            
                            {/* --- قايمة الخيارات --- */}
                            {showOptions && (
                                <div ref={optionsRef} className="message-options-popup">
                                    <button 
                                        className="option-item delete-option" 
                                        onClick={handleDelete}
                                    >
                                        <Trash2 size={14} /> 
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ✅ عرض الصور */}
                    {hasAttachments && (
                        <div className="message-attachments">
                            {message.attachments.map((attachment, index) => (
                                <div 
                                    key={index} 
                                    className="message-image-wrapper"
                                    onClick={() => handleImageClick(attachment.secure_url)}
                                >
                                    <img 
                                        src={attachment.secure_url} 
                                        alt={`Attachment ${index + 1}`}
                                        className="message-image"
                                        loading="lazy"
                                    />
                                    <button
                                        className="download-image-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownload(attachment.secure_url, index);
                                        }}
                                        title="Download"
                                    >
                                        <FontAwesomeIcon icon={faDownload} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {hasContent && (
                        <p className="message-content">{message.content}</p>
                    )}

                    <span className="message-timestamp">
                        {formatTimestamp(message.createdAt)}
                        {isSentByMe && message.isRead && (
                            <CheckCheck className="check-icon" />
                        )}
                        {isSentByMe && !message.isRead && (
                            <Check className="check-icon" />
                        )}
                    </span>
                </div>
            </div>


            {selectedImage && (
                <div className="image-modal-overlay" onClick={handleCloseModal}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={handleCloseModal}>
                            X
                        </button>
                        <img 
                            src={selectedImage} 
                            alt="Full size" 
                            className="modal-image"
                        />
                        <button
                            className="download-modal-btn"
                            onClick={() => handleDownload(selectedImage, 0)}
                        >
                            <FontAwesomeIcon icon={faDownload} />
                            Download
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Message;