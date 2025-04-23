import React, { useState } from 'react';

/**
 * Component for user login and MetaMask wallet connection
 * @component
 */
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [wallet, setWallet] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /**
   * Handles user login by sending credentials to the API
   * @async
   * @function
   * @param {Event} e - The form submit event
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setSuccess('Login successful!');
      console.log('JWT Token:', data.token); // Here you can store it (e.g., localStorage.setItem)
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Connects to the user's MetaMask wallet and retrieves the address
   * @async
   * @function
   */
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const [address] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWallet(address);
      } catch (err) {
        alert('Wallet connection failed');
      }
    } else {
      alert('MetaMask not detected');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login to MyBanker</h2>
      <form onSubmit={handleLogin}>
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
          required
          style={{ width: '100%', marginBottom: '1rem' }}
        />
        <button type="submit" style={{ width: '100%' }}>Login</button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}

      <hr style={{ margin: '2rem 0' }} />

      <button onClick={connectWallet} style={{ width: '100%' }}>
        Connect MetaMask Wallet
      </button>

      {wallet && <p style={{ marginTop: '1rem' }}>Wallet: {wallet}</p>}
    </div>
  );
}

export default Login;