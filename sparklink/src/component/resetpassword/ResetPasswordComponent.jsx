import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./ResetPasswordComponent.css";

const ResetPasswordComponent = () => {
  const [tokenValid, setTokenValid] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const token = searchParams.get("token");

  // Verify token on component load
  useEffect(() => {
    console.log("token>>> ", token);
    const verifyToken = async () => {
      try {
        await axios.get(`/api/users/reset-password?token=${token}`);
        setTokenValid(true);
      } catch (error) {
        setTokenValid(false);
        setErrorMessage(
          error.response?.data?.message || "Token is invalid or expired."
        );
      }
    };

    verifyToken();
  }, [token]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/users/reset-password", {
        token,
        newPassword,
      });

      setSuccessMessage(response.data.message || "Password reset successful.");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to reset password."
      );
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return <div className="loader">Loading...</div>; // Show loader while verifying token
  }

  return (
    <div className="container-fluid reset-password-page">
      {tokenValid ? (
        <div className="reset-password-container">
          <h2 className="title">Reset Password</h2>
          <form className="form" onSubmit={handlePasswordReset}>
            <input
              type="password"
              className="form-control"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary btn-block">
              Reset Password
            </button>
          </form>
          {successMessage && (
            <div>
              <div className="success-message">{successMessage}</div>
              <p className="forgetpassword-text">
                Try Login? <a href="/reset-password-email ">Click here</a>
              </p>
            </div>
          )}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      ) : (
        <div className="error-message">{errorMessage}</div>
      )}
      {/* Loading overlay */}
      {loading && (
        <div className="loading-overlay d-flex justify-content-center align-items-center">
          <div className="text-center">
            <div
              className="spinner-border text-light"
              style={{ width: "5rem", height: "5rem" }}
              role="status"
            ></div>
            <div className="text-light mt-2">Processing...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordComponent;
