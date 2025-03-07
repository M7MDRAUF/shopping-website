// client/src/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', formData);
    if (formData.email && formData.password) {
      setNotification('Login successful! Redirecting to home page...');
      setTimeout(() => {
        setNotification(null);
        navigate('/');
      }, 1000);
    } else {
      setNotification('Please enter email and password.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="container" onClick={() => setNotification(null)}>
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <label>Email</label>
          </div>
          <div className="input-box">
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <label>Password</label>
          </div>
          <div className="forgot-pass">
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>
          <button className="btn" type="submit">Login</button>
          {/* Removed <button className="btn" onClick={() => window.location.href = '/signup'}>Sign Up</button> */}
        </form>
      </div>
      {[...Array(50)].map((_, index) => (
        <span key={index} style={{ '--i': index }}></span>
      ))}
      {notification && (
        <div className="login-notification">
          <p>{notification}</p>
          <button className="close-btn" onClick={() => setNotification(null)}>×</button>
        </div>
      )}
    </div>
  );
}

export default Login;