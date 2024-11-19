import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./LoginComponent.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useAuth } from '../../AuthContext';

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to access query parameters

  useEffect(() => {
    // Extract message query parameter from URL
    const params = new URLSearchParams(location.search);
    const message = params.get("message");

    if (message) {
      setSuccessMessage(message);
    }
  }, [location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/login", {
        email: email,
        password: password,
      }, {
        withCredentials: true // Include credentials in the request
      });

      // Optionally storing token if your backend returns one
      localStorage.setItem("token", response.data.token);
      setSuccessMessage("Login successful!");
      setErrorMessage("");

      setIsAuthenticated(true);
      
      setUser(response.data.user);
      // Redirect to the specified URL from the backend response
      const redirectPath = localStorage.getItem("redirectAfterLogin") || '/';

      console.log("the user logged in is redirect to " + redirectPath);

      navigate(redirectPath, { replace: true });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
      <div className="container-fluid login-page-container">
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
                placeholder="Email"
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
            Don't have an account? <a href="/register">Sign up</a>
          </p>
          <p className="forgetpassword-text">
            Don't have an account? <a href="/reset-password-email ">Forget password</a>
          </p>
        </div>
      </div>
  );
};

export default LoginComponent;
