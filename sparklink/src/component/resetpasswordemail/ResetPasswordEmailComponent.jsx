import React, { useState } from "react";
import "./ResetPasswordEmailComponent.css";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ResetPasswordEmailComponent = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState(location.state?.message || "");

  const handleEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/users/forgot-password", {
        email: email,
      });

      setSuccessMessage(
        "A password reset link has been sent to your registered email address. Please check your inbox."
      );
      setErrorMessage("");
    } catch (error) {
      console.log("error");
      setErrorMessage(
        error.response?.data?.message ||
          "Provided email address is not associated with an account. Please verify the email address and try again."
      );
      setSuccessMessage("");
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid email-page-container">
      <div className="email-container">
        <div className="message">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
        </div>
        <h2 className="title">Enter Registered Email</h2>
        <form className="form" onSubmit={handleEmail}>
          <input
            type="text"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary btn-block">
            Submit
          </button>
        </form>
      </div>
      {/* Loading overlay */}
      {loading && (
          <div className="loading-overlay d-flex justify-content-center align-items-center">
            <div className="text-center">
              <div className="spinner-border text-light" style={{width: "5rem", height: "5rem"}} role="status">
              </div>
              <div className="text-light mt-2">Sending an Email</div>
            </div>
          </div>
        )}
    </div>
  );
};

export default ResetPasswordEmailComponent;
