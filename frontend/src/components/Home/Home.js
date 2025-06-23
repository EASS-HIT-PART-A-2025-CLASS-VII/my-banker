import React, { useState, useEffect } from "react";
import LoginPopup from "../LoginPopup/LoginPopup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faChartLine, faShieldAlt, faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import './Home.css';
import accountingOfficeImage from '../../assets/images/accounting-office.png';
import nycSkylineImage from '../../assets/images/nyc-skyline.png';
import businessmenHandshakeImage from '../../assets/images/businessmen-handshake.png';
import logoImage from '../../assets/images/Logo.png';

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('jwt_token');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
        localStorage.removeItem('jwt_token');
        setIsAuthenticated(false);
      }
    }
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('jwt_token', token);
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setIsAuthenticated(false);
  };

  const goToProfile = () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      setShowLogin(true);
      return;
    }
    navigate('/profile');
  };

  const goToReport = () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      setShowLogin(true);
      return;
    }
    navigate('/report');
  };

  return (
    <div className="landing-page">
      <header className="header">
        <div className="header-content">
          <img src={logoImage} alt="My Banker" className="logo" />
          <nav className="main-nav">
            <ul className="nav-list">
              {!isAuthenticated ? (
                <li className="nav-item login-btn" onClick={() => setShowLogin(true)}>
                  <FontAwesomeIcon icon={faUserCircle} />
                  <span>Sign In</span>
                </li>
              ) : (
                <>
                  <li className="nav-item profile-btn" title="Profile" onClick={goToProfile}>
                    <FontAwesomeIcon icon={faUserCircle} />
                    <span>Profile</span>
                  </li>
                  <li className="nav-item logout-btn" onClick={handleLogout}>
                    <span>Sign Out</span>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {showLogin && (
        <LoginPopup
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Your <span className="highlight-text">Financial Future</span> Starts Here
            </h1>
            <p className="hero-description">
              Upload your crypto wallet address and receive a comprehensive, professional financial report – 
              crafted with the precision and insight of a private banking relationship.
            </p>
            <p className="hero-sub-description">
              Transform complex blockchain data into actionable financial intelligence with our industry-leading analytics platform.
            </p>
            <div className="hero-cta">
              <button className="btn-report-page" onClick={goToReport}>
                <span>Get Your Report</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-container">
              <img src={accountingOfficeImage} alt="Professional Financial Analysis" className="hero-image" />
              <div className="hero-image-overlay"></div>
            </div>
            <div className="floating-stats">
              <div className="stat-card">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Leading Investors Choose My Banker</h2>
          <p className="section-subtitle">Combining traditional finance expertise with cutting-edge blockchain technology</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-image-container">
              <img src={nycSkylineImage} alt="Professional Excellence" className="feature-image" />
              <div className="feature-overlay"></div>
            </div>
            <div className="feature-content">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <h3 className="feature-title">Professional Excellence</h3>
              <p className="feature-description">
                Decades of Wall Street experience meets blockchain innovation. Our platform delivers 
                institutional-grade analysis with the accessibility of modern fintech solutions.
              </p>
              <div className="feature-highlights">
                <span className="highlight-tag">Institutional Grade</span>
                <span className="highlight-tag">Real-time Data</span>
              </div>
            </div>
          </div>

          <div className="feature-card reverse">
            <div className="feature-image-container">
              <img src={businessmenHandshakeImage} alt="Trust & Reliability" className="feature-image" />
              <div className="feature-overlay"></div>
            </div>
            <div className="feature-content">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faShieldAlt} />
              </div>
              <h3 className="feature-title">Trust & Reliability</h3>
              <p className="feature-description">
                Built on transparency and reliability. Our automated analysis provides private banking-level 
                insights with enterprise security, available whenever you need critical financial intelligence.
              </p>
              <div className="feature-highlights">
                <span className="highlight-tag">Bank-Grade Security</span>
                <span className="highlight-tag">24/7 Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h3 className="cta-title">One Simple Step. <span className="highlight-text">Endless Financial Clarity.</span></h3>
            <p className="cta-description">
              My Banker transforms complex crypto data into actionable insights. Whether you're managing 
              a diverse portfolio or exploring new investment opportunities, our comprehensive reports 
              provide the clarity you need to make informed decisions.
            </p>
          </div>
          <div className="cta-benefits">
            <div className="benefit-item">
              <FontAwesomeIcon icon={faChartLine} />
              <span>Comprehensive Portfolio Analysis</span>
            </div>
            <div className="benefit-item">
              <FontAwesomeIcon icon={faShieldAlt} />
              <span>Secure & Private Processing</span>
            </div>
            <div className="benefit-item">
              <FontAwesomeIcon icon={faClock} />
              <span>Instant Professional Reports</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-legal">
            <span>© {new Date().getFullYear()} My Banker. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}