import React, { useState } from 'react';
import './Login.css';

/**
 * Login page for user credentials and MetaMask connection.
 */
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Handle user login
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(data); // Placeholder for future logic
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  // Connect to MetaMask wallet
  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Connected wallet:', accounts[0]);
      } catch (err) {
        console.error('Wallet connection error:', err);
      }
    } else {
      alert('MetaMask is not installed');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Welcome to My Banker</h1>
      <p className="login-description">
        Please enter your username and password, then connect your wallet.
        Once authenticated, you will receive a full financial analysis report.
      </p>
      <div className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="login-actions">
          <button onClick={handleLogin}>Submit</button>
          <button onClick={handleConnectWallet}>Connect Wallet</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
