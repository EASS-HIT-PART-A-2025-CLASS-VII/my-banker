import React, { useState } from 'react';
import './RegisterPopup.css';

const questions = [
  "How important is stability over high returns?",
  "How comfortable are you with short-term swings?",
  "How focused are you on fast growth over preservation?",
  "How experienced are you with crypto investing?",
  "How much do you trust early-stage projects?",
  "How important are social/environmental goals?",
  "How much do you prefer diversification?",
  "How long are you willing to hold underperforming assets?",
  "How often do you review your portfolio?",
  "How open are you to portfolio suggestions?"
];

const RegisterPopup = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [answers, setAnswers] = useState(Array(questions.length).fill(5));

  const handleRangeChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[step - 1] = parseInt(e.target.value);
    setAnswers(newAnswers);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 0) {
      if (!formData.username || !formData.email || !formData.password || formData.password !== formData.confirmPassword) {
        setError("Please fill out all fields correctly and ensure passwords match.");
        return;
      }
      setError('');
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    try {
      const preferences = {
        riskAversion: answers[0],
        volatilityTolerance: answers[1],
        growthFocus: answers[2],
        cryptoExperience: answers[3],
        innovationTrust: answers[4],
        impactInterest: answers[5],
        diversification: answers[6],
        holdingPatience: answers[7],
        monitoringFrequency: answers[8],
        adviceOpenness: answers[9]
      };

      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          preferences
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  const progressPercentage = ((step + 1) / (questions.length + 1)) * 100;

  const getSliderBackground = (value) => {
    const percentage = ((value - 1) / 9) * 100;
    return `linear-gradient(to right, #F9B64D 0%, #F9B64D ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
  };

  return (
    <div className="register-popup-overlay">
      <div className="register-popup">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <button 
          className="close-button"
          onClick={onClose}
        >
          ×
        </button>

        <div className="popup-content">
          {isSuccess ? (
            <div className="success-container">
              <div className="success-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="success-title">Welcome aboard! 🎉</h2>
              <p className="success-description">
                Your account has been created successfully. You're all set to start your investment journey.
              </p>
              <button 
                className="btn btn-primary btn-full-width"
                onClick={onClose}
              >
                Get Started
              </button>
            </div>
          ) : (
            <>
              {step === 0 ? (
                <div className="form-section">
                  <div className="section-header">
                    <h2 className="section-title">Create Your Account</h2>
                    <p className="section-subtitle">Join thousands of smart investors</p>
                  </div>
                  
                  <div className="form-fields">
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Username</label>
                        <input 
                          name="username" 
                          type="text" 
                          placeholder="Choose a username"
                          value={formData.username} 
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input 
                          name="email" 
                          type="email" 
                          placeholder="your@email.com"
                          value={formData.email} 
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Password</label>
                        <input 
                          name="password" 
                          type="password" 
                          placeholder="Create password"
                          value={formData.password} 
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input 
                          name="confirmPassword" 
                          type="password" 
                          placeholder="Confirm your password"
                          value={formData.confirmPassword} 
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="question-section">
                  <div className="question-header">
                    <div className="question-counter">Question {step} of {questions.length}</div>
                    <h2 className="question-title">{questions[step - 1]}</h2>
                  </div>
                  
                  <div className="range-container">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={answers[step - 1]}
                      onChange={handleRangeChange}
                      className="range-slider"
                      style={{ background: getSliderBackground(answers[step - 1]) }}
                    />
                    
                    <div className="range-labels">
                      <span>Not at all</span>
                      <span className="range-value">{answers[step - 1]}/10</span>
                      <span>Extremely</span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <p className="error-text">{error}</p>
                </div>
              )}

              <div className="button-group">
                {step > 0 && (
                  <button 
                    className="btn btn-secondary"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                )}
                <button
                  className="btn btn-primary"
                  onClick={step === questions.length ? handleSubmit : handleNext}
                >
                  {step === questions.length ? 'Create Account' : 'Continue'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPopup;