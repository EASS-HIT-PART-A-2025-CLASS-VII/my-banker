// components/ProfilePage/ProfilePage.js
import React, { useState } from "react";
import './ProfilePage.css';
import profileImg from '../../assets/images/default-profile.png';
import { decodeJWT } from '../../utils/decodeJWT';
import UpdatePopup from '../UpdatePopup/UpdatePopup';
import DeletePopup from '../DeletePopup/DeletePopup';

export default function ProfilePage() {
  const token = localStorage.getItem("jwt_token");
  const user = decodeJWT(token);
  const username = user?.username || "Unknown";

  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  return (
    <div className="profile-container">
      <img src={profileImg} alt="Profile" className="profile-image" />
      <h2 className="profile-name">{username}</h2>

      <button className="btn-secondary" onClick={() => setShowUpdatePopup(true)}>Update Details</button>
      <button className="btn-danger" onClick={() => setShowDeletePopup(true)}>Delete Account</button>

      {showUpdatePopup && <UpdatePopup onClose={() => setShowUpdatePopup(false)} />}
      {showDeletePopup && <DeletePopup onClose={() => setShowDeletePopup(false)} />}
    </div>
  );
}
