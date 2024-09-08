import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../apis/api';
import './Signup.css'; 

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    console.log('signup successful');

    try {
        await register({ email: formData.email, password: formData.password });
        navigate('/');
      } catch (error) {
        console.error('Registration error:', error);
      }
  };

  const handleGoogleSignUp = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="signup-container">
      <header className="signup-navbar">
        <div className="signup-logo">📅</div>
        <div className="signup-nav-links">
          <a href="/" className="signup-login-link">Login</a>
          <button className="signup-btn">Signup</button>
        </div>
      </header>
      <div className="signup-form-container">
        <h2 className="signup-title">Signup</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="signup-input-field"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="signup-input-field"
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="signup-input-field"
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="signup-input-field"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="signup-input-field"
            required
          />
          <button type="submit" className="submit-btn">Signup</button>
        </form>
        <div className="additional-links">
          <p>Already have an account? <a href="/" className="login-link">Login</a></p>
          <button className="google-btn" onClick={handleGoogleSignUp}>Signup with Google</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;

