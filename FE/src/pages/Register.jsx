import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import  authService  from "../services/auth.js";
import Logo from "../assets/Logo.png";
import '../style/RegisterForm.css';
import { GoogleLogin } from '@react-oauth/google';






const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        gender: 'male',
        
    })
        const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

     try {

            const response = await authService.signupUser(formData);


            setSuccessMessage(response.data.message || "Registration successful! Check your email.");

            setTimeout(() => {

                navigate('/verify-email', { state: { email: formData.email } });
            }, 2000);

        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to sign up";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError('');
        try {
            const idToken = credentialResponse.credential;
            await authService.googleSignIn(idToken);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Google Sign-Up failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = (error) => {
        console.error(error);
        setError('Google Sign-Up failed.');
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

                <div className="name-inputs">
                    <input name="firstName" type="text" className="auth-input" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
                    <input name="lastName" type="text" className="auth-input" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
                </div>
                
                <input name="email" type="email" className="auth-input" value={formData.email} onChange={handleChange} placeholder="Email" required />
                <input name="password" type="password" className="auth-input" value={formData.password} onChange={handleChange} placeholder="Password" required />
                <input name="phone" type="tel" className="auth-input" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
                
                <select name="gender" className="auth-input" value={formData.gender} onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? 'LOADING...' : 'SIGN UP'}
                </button>

                   <div className="divider">
                                    <span>OR</span>
                                </div>
                                
                                <div className="google-btn-container">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleError}
                                        

                                    />
                                </div>

                <div className="links-container">
                    <span>Already have an account?</span>
                    <Link to="/Login" className="auth-link">Login</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;
