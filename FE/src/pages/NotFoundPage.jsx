import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import '../style/NotFoundPage.css'; // تأكد من المسار الصحيح
import robotAnimation from '../assets/Error 404.json';
import messageError from '../assets/Lonely 404.json';
const NotFoundPage = () => {
    return (
        <div className="error-page-container">
            
            <div className="error-image-content">
                
                <Lottie 
                    animationData={robotAnimation} // ملف الأنيميشن
                    loop={true} // تكرار الحركة
                    autoplay={true} // تشغيل تلقائي
                    className="error-robot-animation" // كلاس للتحكم في الحجم
                />
                
                <span className="background-404-text">404</span>
            </div>

            <div className="error-text-content">
                <Lottie 
                    animationData={messageError} // ملف الأنيميشن
                    loop={true} // تكرار الحركة
                    autoplay={true} // تشغيل تلقائي
                    className="error-message-animation" // كلاس للتحكم في الحجم
                />
                <h1>Oops! You seem lost...</h1>
                <p>
                    The page you're looking for might have floated away 
                    into the digital void, or you typed the wrong address.
                </p>
                <Link to="/" className="error-home-button">
                    Go Back Home
                </Link>
            </div>

        </div>
    );
};

export default NotFoundPage;