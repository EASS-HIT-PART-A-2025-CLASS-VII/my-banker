import React, { useState } from "react";
import LoginPopup from "../LoginPopup/LoginPopup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import './Home.css';
import accountingOfficeImage from '../../assets/images/accounting-office.png';
import nycSkylineImage from '../../assets/images/nyc-skyline.png';
import businessmenHandshakeImage from '../../assets/images/businessmen-handshake.png';

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwt_token'));
  const navigate = useNavigate();

  const handleLoginSuccess = (token) => {
    localStorage.setItem('jwt_token', token);
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const goToReport = () => {
    navigate('/report');
  };

  return (
    <div className="landing-page">
      <header className="header">
        <h1 className="title">My Banker</h1>
        <nav>
          <ul className="nav-list">
            {!isAuthenticated ? (
              <li className="nav-item" style={{ cursor: 'pointer' }} onClick={() => setShowLogin(true)}>
                Login
              </li>
            ) : (
              <li className="nav-item" title="Profile" style={{ cursor: 'pointer' }} onClick={goToProfile}>
                <FontAwesomeIcon icon={faUserCircle} size="2x" />
              </li>
            )}
          </ul>
        </nav>
      </header>

      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h2>Your Financial Future Starts Here</h2>
          <p>Upload your crypto wallet address and get a professional, personalized financial report – crafted as if by your own private banker.</p>
          <p>Let's shape a brighter financial future, together. Let us help you make the right decisions with tailored insights you can trust.</p>
          <button className="btn-primary" onClick={goToReport}>Get Your Report</button>
        </div>
        <div className="hero-image">
          <img src={accountingOfficeImage} alt="Private Banker" />
        </div>
      </section>

      {/* Image Strip */}
      <section className="image-strip">
        <img src={accountingOfficeImage} alt="Office" />
        <img src={nycSkylineImage} alt="NYC Skyline" />
        <img src={businessmenHandshakeImage} alt="Handshake" />
      </section>

      {/* Call to Action */}
      <section className="call-to-action">
        <h3>One Simple Step. Endless Financial Clarity.</h3>
        <p>My Banker is the easiest way to understand your crypto portfolio. Whether you're managing assets or exploring investments, our report gives you the insights you need.</p>
      </section>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} My Banker. All rights reserved.
      </footer>
    </div>
  );
}
