import React, { useState, useRef, useEffect } from 'react';
import './otp.css';

const OtpInput = ({ length = 6, digitsPerBox = 2, onChange }) => {
    const numInputs = length / digitsPerBox;
    const [otp, setOtp] = useState(new Array(numInputs).fill(""));
    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (element, index) => {
        const value = element.value;
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - digitsPerBox);
        setOtp(newOtp);

        onChange(newOtp.join(""));

        if (value.length >= digitsPerBox && index < numInputs - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="otp-input-container">
            {otp.map((data, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text" 
                    inputMode="numeric" 
                    className={`otp-box otp-index${index}`}
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                    maxLength={digitsPerBox}
                />
            ))}
        </div>
    );
};

export default OtpInput;