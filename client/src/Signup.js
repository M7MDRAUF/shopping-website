// client/src/Signup.js
import React, { useState } from 'react';
import './App.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup attempt with:', formData);
    setNotification('Signup successful! Please log in.');
    setFormData({
      username: '',
      email: '',
      password: '',
    });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="container" onClick={() => setNotification(null)}>
      <div className="login-box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
            />
            <label>Username</label>
          </div>
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
          <button className="btn" type="submit">Sign Up</button>
          {/* Removed <div className="signup-link"><p>Already have an account? <Link to="/login">Login</Link></p></div> */}
        </form>
      </div>
      {[...Array(50)].map((_, index) => (
        <span key={index} style={{ '--i': index }}></span>
      ))}
      {notification && (
        <div className="signup-notification">
          <p>{notification}</p>
          <button className="close-btn" onClick={() => setNotification(null)}>×</button>
        </div>
      )}
    </div>
  );
}

export default Signup;