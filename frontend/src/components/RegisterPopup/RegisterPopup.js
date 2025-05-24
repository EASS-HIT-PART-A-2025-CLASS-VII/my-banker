import React, { useState } from "react";
import './RegisterPopup.css';

export default function RegisterPopup({ onClose, onRegisterSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async () => {
        try {
            const response = await fetch("http://localhost:8000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok && data.data?.message) {
                onRegisterSuccess(data.data.message);
            } else {
                setError(data.data?.message || "Registration failed");
            }
        } catch (err) {
            setError("Server error: " + err.message);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Register</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                {error && <p className="error">{error}</p>}
                <button onClick={handleRegister} className="btn-primary">Register</button>
            </div>
        </div>
    );
}
