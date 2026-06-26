import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.email === 'admin@brandsparkx.com' && credentials.password === 'admin123') {
      onLogin(true);
      navigate('/admin/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">⚡</div>
        <h2 className="login-title">Welcome back</h2>
        <p className="login-sub">Sign in to your brandsparkx workspace</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-group">
            <label>Email address</label>
            <input type="email" name="email" value={credentials.email}
              onChange={handleChange} required placeholder="you@brandsparkx.com" />
          </div>
          <div className="login-group">
            <label>Password</label>
            <input type="password" name="password" value={credentials.password}
              onChange={handleChange} required placeholder="••••••••" />
          </div>
          <button type="submit" className="login-btn">Sign in →</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
