import React from "react";
import '../Popup/Popup.css';

export default function DeletePopup({ onClose }) {
  const handleDelete = async () => {
    const token = localStorage.getItem("jwt_token");
    try {
      const res = await fetch("http://localhost:8000/auth/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        alert("User deleted successfully!");
        localStorage.removeItem("jwt_token");
        window.location.href = "/";
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="delete-popup-content">
          <h3>Delete Account</h3>
          <p className="warning-text">
            Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
          </p>
          <div className="button-group">
            <button onClick={handleDelete} className="btn btn-danger">
              Yes, Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}