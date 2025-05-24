// components/ProfilePage/UpdatePopup.js
import React, { useState } from "react";
import '../Popup/Popup.css';

export default function UpdatePopup({ onClose }) {
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async () => {
    const token = localStorage.getItem("jwt_token");
    try {
      const res = await fetch("http://localhost:8000/auth/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ password: newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Password updated successfully!");
        onClose();
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>Update Password</h3>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose} className="close-button">Cancel</button>
      </div>
    </div>
  );
}
