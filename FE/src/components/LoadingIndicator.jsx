import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../assets/loading-animation.json'; 
import './LoadingIndicator.css'; // ملف CSS اختياري للتوسيط

const LoadingIndicator = ({ width = 450, height = 400}) => { // يمكنك التحكم بالحجم عبر props
    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className="loading-indicator-container"> 
            <Lottie 
                animationData={animationData} 
                loop={true}
                autoplay={true}
                style={{ width, height }}
            />
        </div>
    );
};


export const SaveLoader = ({ width = 450, height = 400 }) => {
    return (
        <div className="loading-indicator-container">

            <Lottie 
                animationData={animationData} 
                loop={true} 
                autoplay={true} 
                style={{ width, height }} 
            />
        </div>
    );
};
/*******  de5fdf13-98c9-4951-850f-ff67d1f9083f  *******/



export default LoadingIndicator;