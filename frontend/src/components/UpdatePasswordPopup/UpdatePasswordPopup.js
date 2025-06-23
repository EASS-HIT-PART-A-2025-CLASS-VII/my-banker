import React, { useState } from "react";
import '../Popup/Popup.css';

export default function UpdatePasswordPopup({ onClose, onSuccess }) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleUpdatePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/auth/updatePassword", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    username: localStorage.getItem('username'),
                    newPassword
                }),
            });

            const data = await response.json();
            if (response.ok && data.status === 200) {
                onSuccess(data.data.message);
                onClose();
            } else {
                setError(data.error?.message || "Password update failed");
            }
        } catch (err) {
            setError("Server error: " + err.message);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <button className="close-button" onClick={onClose}>×</button>
                
                <h2>Change Password</h2>
                
                <div className="form-container">
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                    
                    {error && <p className="error">{error}</p>}
                </div>
                
                <button className="btn" onClick={handleUpdatePassword}>
                    Update Password
                </button>
            </div>
        </div>
    );
}