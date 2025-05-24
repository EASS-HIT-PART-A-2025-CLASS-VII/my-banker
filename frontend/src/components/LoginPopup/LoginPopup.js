import React, { useState } from "react";
import './LoginPopup.css';

export default function LoginPopup({ onClose, onSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok && data.data && data.data.message) {
                onSuccess(data.data.message); 
            } else {
                setError(data.data?.message || "Login failed");
            }
        } catch (err) {
            setError("Server error: " + err.message);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Login</h2>
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
                <button onClick={handleLogin}>Login</button>
                <button className="register-btn">Go to Register</button>
            </div>
        </div>
    );
}
