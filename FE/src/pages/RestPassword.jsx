import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/auth.js";
import '../style/LoginForm.css';
import logo from '../assets/Logo.png'; 
import OtpInput from "../components/OtpInput.jsx"; // Assuming you want the OTP input here too

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        otp: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [timer, setTimer] = useState(60); // <-- 1. إضافة حالة المؤقت

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    
    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {

            const response = await authService.resetPassword({ email, ...formData });
            setSuccessMessage(response.data.message + ". Redirecting to login...");
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
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

            await authService.forgetPassword({ email });
            setSuccessMessage("A new OTP has been sent.");
            setTimer(60); // إعادة تشغيل المؤقت
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP.');
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
                
                <h2>Reset Password</h2>
                
                {/* استخدام كومبوننت OtpInput لتحسين تجربة المستخدم */}
                <OtpInput
                    length={6}
                    onChange={(otpValue) => setFormData({ ...formData, otp: otpValue })}
                />
                
                <input
                    name="password"
                    type="password"
                    className="auth-input"
                    placeholder="New Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    name="confirmPassword"
                    type="password"
                    className="auth-input"
                    placeholder="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? 'RESETTING...' : 'RESET PASSWORD'}
                </button>

                {/* 4. إضافة منطق عرض المؤقت أو زر إعادة الإرسال */}
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

export default ResetPassword;