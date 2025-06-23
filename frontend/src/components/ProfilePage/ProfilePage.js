import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import DeletePopup from '../DeletePopup/DeletePopup';
import UpdateEmailPopup from '../UpdateEmailPopup/UpdateEmailPopup';
import UpdatePasswordPopup from '../UpdatePasswordPopup/UpdatePasswordPopup';

function ProfilePage() {
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
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
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('jwt_token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        if (!token || !username) {
          setError('Authentication required');
          navigate('/');
          return;
        }

        const response = await fetch(`http://localhost:8000/user/preferences/${username}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 200 && data.data?.message) {
          setPreferences(data.data.message);
          setError(null);
        } else {
          setError(data.error?.message || 'Failed to load preferences');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError(`Failed to fetch preferences: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, [navigate, token, username]);

  const handlePreferenceChange = (preference, value) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: value
    }));
  };

  const handleSavePreferences = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/updatePreferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: username,
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

  const formatLabel = (key) => {
    return key.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const getPreferenceDescription = (key) => {
    const descriptions = {
      riskAversion: "How cautious are you with investments?",
      volatilityTolerance: "Comfort level with market fluctuations",
      growthFocus: "Preference for growth vs. stability",
      cryptoExperience: "Experience with cryptocurrency markets",
      innovationTrust: "Trust in emerging financial technologies",
      impactInterest: "Interest in sustainable/impact investing",
      diversification: "Preference for portfolio diversification",
      holdingPatience: "Long-term vs. short-term investment approach",
      monitoringFrequency: "How often you check your investments",
      adviceOpenness: "Openness to professional financial advice"
    };
    return descriptions[key] || "";
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your preferences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="error-container">
          <h2>Error Loading Profile</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ←
        </button>
        <h1>Profile Settings</h1>
      </div>

      <div className="profile-container">
        <div className="preferences-section">
          <div className="section-header">
            <div className="section-icon">
              📈
            </div>
            <h2>Investment Preferences</h2>
            <p className="section-description">Customize your investment profile to receive personalized recommendations</p>
          </div>
          
          <div className="preferences-grid">
            {Object.entries(preferences).map(([key, value]) => (
              <div key={key} className="preference-item">
                <div className="preference-header">
                  <label className="preference-label">{formatLabel(key)}</label>
                  <div className="preference-value">{value}/10</div>
                </div>
                <p className="preference-description">{getPreferenceDescription(key)}</p>
                
                <div className="range-container">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={(e) => handlePreferenceChange(key, parseInt(e.target.value))}
                    className="preference-slider"
                  />
                  <div className="range-labels">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="save-section">
            <button 
              onClick={handleSavePreferences}
              className="btn btn-primary"
            >
              💾 Save Preferences
            </button>
          </div>
        </div>

        <div className="account-section">
          <div className="settings-group">
            <div className="settings-group-header">
              🛡️ <h3>Security</h3>
            </div>
            <div className="settings-buttons">
              <button 
                onClick={() => setShowEmailPopup(true)}
                className="setting-btn"
              >
                📧
                <div className="setting-info">
                  <span className="setting-title">Update Email</span>
                  <span className="setting-description">Change your email address</span>
                </div>
              </button>
              
              <button 
                onClick={() => setShowPasswordPopup(true)}
                className="setting-btn"
              >
                🔒
                <div className="setting-info">
                  <span className="setting-title">Change Password</span>
                  <span className="setting-description">Update your account password</span>
                </div>
              </button>
            </div>
          </div>

          <div className="danger-zone">
            <div className="danger-header">
              <h3>Danger Zone</h3>
              <p>Irreversible and destructive actions</p>
            </div>
            <button 
              onClick={() => setShowDeletePopup(true)}
              className="btn btn-danger"
            >
              🗑️ Delete Account
            </button>
          </div>
        </div>
      </div>
      
      {showEmailPopup && (
        <UpdateEmailPopup
          onClose={() => setShowEmailPopup(false)}
          onSuccess={(message) => {
            alert('Email updated successfully!');
            setShowEmailPopup(false);
          }}
        />
      )}

      {showPasswordPopup && (
        <UpdatePasswordPopup
          onClose={() => setShowPasswordPopup(false)}
          onSuccess={(message) => {
            alert('Password updated successfully!');
            setShowPasswordPopup(false);
          }}
        />
      )}

      {showDeletePopup && (
        <DeletePopup
          onClose={() => setShowDeletePopup(false)}
        />
      )}
    </div>
  );
}

export default ProfilePage;