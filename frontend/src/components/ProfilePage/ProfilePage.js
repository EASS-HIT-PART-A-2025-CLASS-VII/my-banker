import React, { useState } from 'react';
import './ProfilePage.css';
import UpdatePopup from '../UpdatePopup/UpdatePopup';
import DeletePopup from '../DeletePopup/DeletePopup';

function ProfilePage() {
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="avatar" />
        <h1 className="username">Welcome, Oron</h1>
        <p className="joined-date">Joined in January 2021</p>
      </div>

      <div className="stats-card">
        <h2>Stats</h2>
        <div className="stats-grid">
          <div className="stat">
            <span className="icon orange">⏳</span>
            <p>7 minutes</p>
            <small>Avg session</small>
          </div>
          <div className="stat">
            <span className="icon blue">🕒</span>
            <p>3873 minutes</p>
            <small>Total time</small>
          </div>
          <div className="stat">
            <span className="icon green">✅</span>
            <p>538 sessions</p>
            <small>Completed</small>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={() => setShowUpdatePopup(true)} className="btn update-btn">Update Preferences</button>
        <button onClick={() => setShowDeletePopup(true)} className="btn delete-btn">Delete My Account</button>
      </div>

      {showUpdatePopup && <UpdatePopup onClose={() => setShowUpdatePopup(false)} />}
      {showDeletePopup && <DeletePopup onClose={() => setShowDeletePopup(false)} />}
    </div>
  );
}

export default ProfilePage;
