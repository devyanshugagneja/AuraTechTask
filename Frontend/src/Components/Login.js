import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';  

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      navigate('/landing');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Use navigate instead of anchor tag
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="input-container">
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p className="register-link">Don't have an account? 
        <span onClick={handleRegisterClick} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}> Register here</span>
      </p>
    </div>
  );
};

export default Login;
