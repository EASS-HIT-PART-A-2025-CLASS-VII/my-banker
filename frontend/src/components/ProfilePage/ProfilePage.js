import React, { useState } from 'react';
import './ProfilePage.css';
import UpdatePopup from '../UpdatePopup/UpdatePopup';
import DeletePopup from '../DeletePopup/DeletePopup';

function ProfilePage() {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [preferences, setPreferences] = useState({
    riskAversion: 5,
    volatilityTolerance: 5,
    growthFocus: 5,
    cryptoExperience: 5,
    innovationTrust: 5,
    impactInterest: 5,
    diversification: 5,
    holdingPatience: 5,
    monitoringFrequency: 5,
    adviceOpenness: 5
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlePreferenceChange = (preference, value) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: value
    }));
  };

  const handleSavePreferences = async () => {
    try {
      const response = await fetch('/api/auth/updatePreferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          username: localStorage.getItem('username'),
          ...preferences
        })
      });
      const data = await response.json();
      if (data.status === 200) {
        alert('Preferences updated successfully!');
      }
    } catch (error) {
      alert('Failed to update preferences');
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const response = await fetch('/api/auth/updateEmail', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          username: localStorage.getItem('username'),
          newEmail: email
        })
      });
      const data = await response.json();
      if (data.status === 200) {
        alert('Email updated successfully!');
        setEmail('');
      }
    } catch (error) {
      alert('Failed to update email');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const response = await fetch('/api/auth/updatePassword', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          username: localStorage.getItem('username'),
          newPassword: password
        })
      });
      const data = await response.json();
      if (data.status === 200) {
        alert('Password updated successfully!');
        setPassword('');
      }
    } catch (error) {
      alert('Failed to update password');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="avatar" />
        <h1 className="username">Welcome, {localStorage.getItem('username')}</h1>
      </div>

      <div className="preferences-section">
        <h2>Investment Preferences</h2>
        <div className="preferences-grid">
          {Object.entries(preferences).map(([key, value]) => (
            <div key={key} className="preference-item">
              <label>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={value}
                onChange={(e) => handlePreferenceChange(key, parseInt(e.target.value))}
              />
            </div>
          ))}
        </div>
        <button onClick={handleSavePreferences} className="btn save-btn">
          Save Preferences
        </button>
      </div>

      <div className="account-section">
        <h2>Account Settings</h2>
        <div className="update-email">
          <input
            type="email"
            placeholder="New Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleUpdateEmail} className="btn update-btn">
            Update Email
          </button>
        </div>

        <div className="update-password">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleUpdatePassword} className="btn update-btn">
            Update Password
          </button>
        </div>

        <button onClick={() => setShowDeletePopup(true)} className="btn delete-btn">
          Delete My Account
        </button>
      </div>

      {showDeletePopup && <DeletePopup onClose={() => setShowDeletePopup(false)} />}
    </div>
  );
}

export default ProfilePage;