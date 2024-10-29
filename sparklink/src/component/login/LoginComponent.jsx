import React, { useState } from "react";
import axios from "axios";
import MasterComponent from "../MasterComponent";
import "./LoginComponent.css";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log("Email:", email);
    console.log("Password:", password);
    try {
      const response = await axios.post("/api/users/login", {
        email: email,
        password: password,
      });

      // If the login is successful, you can handle the response here
      console.log("Login successful!", response.data);
      // You might want to store a token or redirect the user after a successful login
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      // Optionally show an error message to the user
    }
  };

  return (
    <div className="container-fluid containerfluid">
      <div className="login-container">
        <div className="message">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
        </div>
        <h2 className="title">Login</h2>
        <form className="form" onSubmit={handleLogin}>
          <div className="input-container">
            <i className="fas fa-user"></i>
            <input
              type="email"
              className="input"
              placeholder="Email/Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="button">
            Log In
          </button>
        </form>
        <p className="signup-text">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
