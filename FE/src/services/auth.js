import axios from "axios";
import { API_BASE_URL } from "../../config.js";

const API_URL = `${API_BASE_URL}/auth`;


const loginUser = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);

    if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
    }
    return response.data;
};


const signupUser = async (userData) => {


    const response = await axios.post(`${API_URL}/register`, userData);
    return response; // نرجع الرد كاملًا
};


const confirmEmail = async (data) => {


    return await axios.post(`${API_URL}/confirm-email`, data);
};


const resendOtp = async (data) => {

    return await axios.post(`${API_URL}/resend-otp`, data);
};

const forgetPassword = async (data) => {

    return await axios.post(`${API_URL}/forgot-password`, data);
};

const resetPassword = async (data) => {

    return await axios.post(`${API_URL}/reset-password`, data);
};

const googleSignIn = async (idToken) => {
    const response = await axios.post(`${API_URL}/google-signup`, { idToken });
    if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
    }
    return response.data;
};



const authService = {
    loginUser,
    signupUser,
    confirmEmail,
    resendOtp,
    forgetPassword,
    resetPassword,
    googleSignIn
};

export default authService;