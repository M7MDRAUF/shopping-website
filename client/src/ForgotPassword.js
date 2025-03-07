// client/src/ForgotPassword.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css'; // Use the same CSS for consistency

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setNotification('Please enter your email address.');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // Simulate sending reset email (replace with actual API call later)
    console.log('Password reset request for:', email);
    setNotification('Password reset link has been sent to your email. Redirecting to login...');
    
    // Simulate redirect after sending reset email
    setTimeout(() => {
      setNotification(null);
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="container" onClick={() => setNotification(null)}>
      <div className="login-box">
        <h2>Forgot Password</h2>
        <p>Enter your email address to receive a password reset link.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={handleChange}
            />
            <label>Email</label>
          </div>
          <button className="btn" type="submit">Send Reset Link</button>
          <div className="forgot-pass">
            <Link to="/login">Back to Login</Link>
          </div>
        </form>
      </div>
      {[...Array(50)].map((_, index) => (
        <span key={index} style={{ '--i': index }}></span>
      ))}

      {/* Notification for Reset Feedback */}
      {notification && (
        <div className="login-notification">
          <p>{notification}</p>
          <button className="close-btn" onClick={() => setNotification(null)}>×</button>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;