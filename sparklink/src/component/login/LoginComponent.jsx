import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom"; // Import useHistory hook
import "./LoginComponent.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const history = useHistory(); // Initialize useHistory hook

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/login", {
        email: email,
        password: password,
      });
      // Redirect to the intended route or dashboard
      history.push(response.data.redirectTo || '/');
      setSuccessMessage("Login successful!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Login failed. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div style={{
      height: "100vh",
      background: "linear-gradient(to top, #5f7f9f, #2c3d5c)"
    }}>
      <div className="container-fluid login-backend">
        <div className="login-container">
          <div className="message">
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
          </div>
          <h2 className="title">Login</h2>
          <form className="form" onSubmit={handleLogin}>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text custom-icon">
                  <i className="fas fa-user"></i>
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text custom-icon">
                  <i className="fas fa-lock"></i>
                </span>
              </div>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Log In
            </button>
          </form>
          <p className="signup-text">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
