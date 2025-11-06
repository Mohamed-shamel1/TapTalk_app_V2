import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.js';
import '../style/LoginForm.css';
import logo from '../assets/Logo.png';
import { GoogleLogin } from '@react-oauth/google';
import LoadingIndicator from '../components/LoadingIndicator.jsx'; // <-- 1. استيراد كومبوننت اللودينج

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // حالة التحميل
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // ابدأ التحميل
        setError('');
        try {
            const response = await authService.loginUser({ email, password });
            if (response && response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            } else {
                 setError("Login response did not contain a token.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to log in");
        } finally {
            setLoading(false); // أوقف التحميل عند الانتهاء (سواء نجح أو فشل)
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true); // ابدأ التحميل
        setError('');
        try {
            const idToken = credentialResponse.credential;
            const response = await authService.googleSignIn(idToken);
            if (response && response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            } else {
                setError("Google sign-in response did not contain a token.");
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Google Sign-In failed.');
        } finally {
            setLoading(false); // أوقف التحميل عند الانتهاء
        }
    };

    const handleGoogleError = () => {
        setError('Google Sign-In was unsuccessful. Please try again.');
    };


    if (loading) {

        return (
            <div className="auth-page-container"> {/* استخدم نفس الحاوية للتوسيط */}
                 <div className="background-grid"> {/* أبقِ على الخلفية */}
                    <div className="grid-cell color-1"></div>
                    <div className="grid-cell color-2"></div>
                    <div className="grid-cell color-3"></div>
                    <div className="grid-cell color-4"></div>
                </div>
                <LoadingIndicator width={200} height={200} /> {/* يمكنك تعديل الحجم */}
            </div>
        );
    }


    return (
        <div className="auth-page-container">
            <div className="background-grid">
                <div className="grid-cell color-1"></div>
                <div className="grid-cell color-2"></div>
                <div className="grid-cell color-3"></div>
                <div className="grid-cell color-4"></div>
            </div>

            <form onSubmit={handleLogin} className="login-card">
                <img src={logo} alt="Company Logo" className="logo-image" />

                <input
                    type="email"
                    className="auth-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email / Username"
                    required
                />
                <input
                    type="password"
                    className="auth-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                
                {error && <p className="error-message">{error}</p>}

                {/* ✅ 3. لم نعد بحاجة لتغيير النص هنا، لكن تعطيل الزر لا يزال مفيدًا */}
                <button type="submit" className="auth-button" disabled={loading}>
                    LOGIN
                </button>

                <div className="links-container">
                    <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
                    <span className="link-separator">•</span>
                    <Link to="/register" className="auth-link">Sign Up</Link>
                </div>

                <div className="divider">
                    <span>OR</span>
                </div>
                
                <div className="google-btn-container">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                    />
                </div>
            </form>
        </div>
    );
};

export default LoginForm;