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
      // Simple validation example
      if (!formData.username || !formData.email || !formData.password || formData.password !== formData.confirmPassword) {
        alert("Please fill out all fields correctly.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    const dataToSubmit = {
      ...formData,
      preferences: answers
    };
    console.log("Submitting:", dataToSubmit);
    onClose(); // Replace with actual submission logic
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose}>&times;</button>

        {step === 0 ? (
          <div className="form-fields">
            <input name="username" type="text" placeholder="Username" value={formData.username} onChange={handleInputChange} />
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} />
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} />
          </div>
        ) : (
          <div className="step-content">
            <label>{questions[step - 1]}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={answers[step - 1]}
              onChange={handleRangeChange}
              className="custom-range"
            />
          </div>
        )}

        <div className="button-group">
          {step > 0 && (
            <button className="btn-secondary" onClick={handleBack}>
              Back
            </button>
          )}
          <button className="btn-primary" onClick={step === questions.length ? handleSubmit : handleNext}>
            {step === questions.length ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPopup;
