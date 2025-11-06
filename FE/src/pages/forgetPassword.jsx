import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.js";
import '../style/LoginForm.css'; // استخدام نفس ملف الـ CSS
import logo from '../assets/Logo.png'; 

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await authService.ForgetPassword({ email });
            setSuccessMessage(response.data.message + ". Redirecting...");
            

            setTimeout(() => {
                navigate('/reset-password', { state: { email } }); // نرسل الإيميل للصفحة التالية
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send password reset instructions.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="background-grid">
                <div className="background-grid">
                <div className="grid-cell color-1"></div>
                <div className="grid-cell color-2"></div>
                <div className="grid-cell color-3"></div>
                <div className="grid-cell color-4"></div>
            </div>
            </div>
            <form onSubmit={handleSubmit} className="login-card">
                <img src={logo} alt="Logo" className="logo-image" />
                
                <h2 style={{ marginBottom: '0.5rem' }}>Forgot Password</h2>
                <p style={{ color: '#666', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Enter your email and we'll send you an OTP to reset your password.
                </p>

                <input
                    type="email"
                    className="auth-input"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? 'SENDING...' : 'SEND OTP'}
                </button>

                <div className="links-container" style={{ marginTop: '1.5rem' }}>
                    <Link to="/login" className="auth-link">Back to Login</Link>
                </div>
            </form>
        </div>
    );
};

export default ForgetPassword;