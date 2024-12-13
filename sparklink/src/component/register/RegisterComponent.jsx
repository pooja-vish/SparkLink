import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./RegisterComponent.css";
import sparklink_icon from "../../assets/SparkLink_icon.png";
import backgroundImage from "../../assets/background3.jpg"; // Add your background image here
import signupImage from "../../assets/signup-image.jpg";
import sparklink_logo from "../../assets/SparkLink_Logo_3.png";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axiosInstance from './axiosInstance';

const RegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [showPassword2, setShowPassword2] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    if ((role === "3" || role === "4") && !email.endsWith("@uwindsor.ca")) {
      setErrorMessage("Email should end with @uwindsor.ca");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/api/users/register", {
        username,
        email,
        password,
        confirmPassword,
        name,
        role,
      });

      setSuccessMessage("Please check your email to confirm your account.");
      setErrorMessage("");
    } catch (error) {
      console.log(error);
      setErrorMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main row-2">
      <section className="vh-100">
        <div className="container-fluid">
          <div className="row heading-register text-end">
            <Link to="/">
              <img src={sparklink_logo} alt="Logo" className="sparklink_logo" />
            </Link>
          </div>
          <div className="row d-flex justify-content-center align-items-center h-100">
            {/* Form Section */}
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form
                className="register-form"
                id="register-form"
                onSubmit={handleSubmit}
              >
                <h2 className="form-title">Sign up</h2>

                {/* Name Field */}

                <div data-mdb-input-init className="form-outline mb-4">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div data-mdb-input-init className="form-outline mb-4">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Last Name"
                    required
                  />
                </div>
                {/* Email Field */}
                <div data-mdb-input-init className="form-outline mb-4">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Your Email"
                    required
                  />
                </div>
                {/* Password Field */}
                <div data-mdb-input-init className="form-outline mb-4  position-relative" >
                  <input
                     type={showPassword ? "text" : "password"} 
                    name="pass"
                    id="pass"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Password"
                    required
                  />
                  <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} position-absolute`}  // FontAwesome eye icon
                  style={{ right: 10, top: 17, cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}  // Toggle password visibility
                ></i>
                </div>
                {/* Repeat Password Field */}
                <div data-mdb-input-init className="form-outline mb-4 position-relative">
                  <input
                    type={showPassword2 ? "text" : "password"}
                    name="re_pass"
                    id="re_pass"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Repeat your password"
                    required
                  />
                   <i
                  className={`fas ${showPassword2 ? "fa-eye-slash" : "fa-eye"} position-absolute`}  // FontAwesome eye icon
                  style={{ right: 10, top: 17, cursor: "pointer" }}
                  onClick={() => setShowPassword2(!showPassword2)}  // Toggle password visibility
                ></i>
                </div>
                <div className="mb-3">
                  <label htmlFor="roleSelect" className="form-label">
                    Roles
                  </label>
                  <select
                    id="roleSelect"
                    className="form-select"
                    value={role} // Assuming `selectedRole` is the state holding the selected role
                    onChange={(e) => setRole(e.target.value)} // Update state on selection
                  >
                    <option value="" disabled>
                      Select a Role
                    </option>
                    <option value="2">Business Owner</option>
                    <option value="3">Supervisor</option>
                    <option value="4">Student</option>
                  </select>
                </div>
                {/* Submit Button */}
                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}
                {successMessage && (
                  <div className="alert alert-success">{successMessage}</div>
                )}
                <div className="text-center text-lg-start mt-4 pt-2">
                  <button
                    type="submit"
                    name="signup"
                    id="signup"
                    className="button_text button-card"
                  >
                    Register
                  </button>
                  <Link to="/login" className="login-link">I am already a member</Link>
                </div>
              </form>
            </div>
            {/* Image Section */}

            <div className="signup-image col-md-9 col-lg-6 col-xl-5">
              <img
                src={signupImage} // Use the path of your image
                className="img-fluid"
                alt="Sign up image"
              ></img>
            </div>
          </div>
        </div>
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
      </section>
    </div>
  );
};

export default RegistrationForm;
