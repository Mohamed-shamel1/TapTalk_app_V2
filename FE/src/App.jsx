import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import VerifyAccount from './pages/verifyEmail.jsx';
import ResetPassword from './pages/RestPassword.jsx';
import ForgetPassword from './pages/forgetPassword.jsx';
import DashboardLayout from './pages/DashboardLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // 1. استيراد الحارس
import NotFoundPage from './pages/NotFoundPage.jsx'; // 2. استيراد صفحة 404

function App() {
  return (
    <Router>
      <Routes>
        {/* === المسارات العامة === */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/verify-email" element={<VerifyAccount />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />

        {/* === المسار المحمي للداش بورد === */}
        <Route element={<ProtectedRoute />}>
          {/* مسار واحد فقط للداش بورد */}
          <Route path="/dashboard" element={<DashboardLayout />} />
        </Route>

        {/* === المسارات الاحتياطية === */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;