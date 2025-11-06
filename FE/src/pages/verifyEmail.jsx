import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/auth.js';
import OtpInput from '../components/OtpInput.jsx';
import '../style/LoginForm.css';
import Logo from '../assets/Logo.png'

const VerifyAccount = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [timer, setTimer] = useState(60);

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authService.confirmEmail({ email, otp });
            setSuccessMessage("Account verified successfully! Redirecting to login...");
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            await authService.resendOtp({ email });
            setSuccessMessage("A new OTP has been sent.");
            setTimer(60);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
                        <div className="background-grid">
                <div className="grid-cell color-1"></div>
                <div className="grid-cell color-2"></div>
                <div className="grid-cell color-3"></div>
                <div className="grid-cell color-4"></div>
            </div>
            <form onSubmit={handleSubmit} className="login-card">
                <img src={Logo} alt="Company Logo" className="logo-image" />
                <h2>Verify Your Account</h2>
                <p style={{ color: '#666', textAlign: 'center', marginBottom: '1.5rem' }}>
                    An OTP has been sent to <br /><strong>{email}</strong>
                </p>
                <OtpInput value={otp} onChange={setOtp} />
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? 'VERIFYING...' : 'VERIFY'}
                </button>
                <div className="links-container" style={{ marginTop: '1rem' }}>
                    {timer > 0 ? (
                        <span style={{ color: '#666' }}>Resend OTP in {timer}s</span>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={loading}
                            className="auth-link"
                            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            Resend OTP
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default VerifyAccount;