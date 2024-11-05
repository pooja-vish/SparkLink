import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./LoginComponent.css";
import '@fortawesome/fontawesome-free/css/all.min.css';



const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 
  
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/login", {
        email: email,
        password: password,
      }, {
        withCredentials: true // Include credentials in the request
      });

      // Optionally store token if your backend returns one
      localStorage.setItem("token", response.data.token); 
      setSuccessMessage("Login successful!");
      setErrorMessage("");
      setIsAuthenticated(true);
      // Redirect to the specified URL from the backend response
      const redirectPath = localStorage.getItem("redirectAfterLogin") || '/';
      console.log("the user logged in is redirect to "+redirectPath);
      navigate(redirectPath, { replace: true }); 
      //localStorage.removeItem("redirectAfterLogin"); // Clear the redirect path
       // Redirect to the URL sent from the backend, or fallback to dashboard

    } catch (error) {
      setErrorMessage(error.response.data.message || "Login failed. Please try again.");
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
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
