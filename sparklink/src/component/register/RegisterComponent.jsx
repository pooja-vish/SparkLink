import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import sparklink_icon from '../../assets/SparkLink_icon.png';
import backgroundImage from '../../assets/background3.jpg'; // Add your background image here

const RegistrationForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('/api/users/register', {
        username,
        email,
        password,
        name,
        isBusinessOwner,
        isSupervisor
      });

      setSuccessMessage('Registration successful!');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Registration failed. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: `url(${backgroundImage}) center/cover no-repeat`,
      padding: "20px"
    }}>
      <div
  className="form-container p-5 rounded shadow"
  style={{
    maxWidth: "450px",
    width: "100%",
    backgroundColor: "rgba(240, 240, 240, 1)",  // Translucent dark color
    color: "rgba(0, 0, 0, 1)",  // White text for better readability on dark background
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    position: "relative",
    zIndex: 1,
  }}
>
        <h2 className="text-center mb-4">
          <img src={sparklink_icon} alt="SparkLink Logo" width="50" className="me-2" />
          Register
        </h2>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Roles</label>
            <div className="form-check">
              <input
                type="checkbox"
                id="businessOwner"
                className="form-check-input"
                checked={isBusinessOwner}
                onChange={(e) => setIsBusinessOwner(e.target.checked)}
              />
              <label htmlFor="businessOwner" className="form-check-label">Business Owner</label>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                id="projectOwner"
                className="form-check-input"
                checked={isSupervisor}
                onChange={(e) => setIsSupervisor(e.target.checked)}
              />
              <label htmlFor="projectOwner" className="form-check-label">Supervisor</label>
            </div>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
