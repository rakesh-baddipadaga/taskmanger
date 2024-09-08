import React, { useState } from 'react';
import './login.css'; 
import { useNavigate } from 'react-router-dom';
import { login } from '../apis/api'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/tasks');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <header className="login-navbar">
        <div className="login-logo">📅</div>
        <div className="login-nav-links">
          <button className="login-btn">Login</button>
          <a href="/signup" className="signup-link">Signup</a>
        </div>
      </header>
      <div className="login-form-container">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="login-input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="submit-btn">Login</button>
        </form>
        <div className="additional-links">
          <p>Don't have an account? <a href="/signup" className="signup-link">Signup</a></p>
          <button className="google-btn">Login with Google</button>
        </div>
      </div>
    </div>
  );
};

export default Login;



