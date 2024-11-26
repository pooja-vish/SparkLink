import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./RegisterComponent.css";
import sparklink_icon from "../../assets/SparkLink_icon.png";
import backgroundImage from "../../assets/background3.jpg"; // Add your background image here
import signupImage from "../../assets/signup-image.jpg";
import sparklink_logo from "../../assets/SparkLink_Logo_3.png";

const RegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("/api/users/register", {
        username,
        email,
        password,
        name,
        role,
      });

      setSuccessMessage("Registration successful!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      setSuccessMessage("");
    }
  };

  return (
    <div className="main">
      <section className="vh-100">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            {/* Form Section */}
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              
              <form className="register-form" id="register-form" onSubmit={handleSubmit}>
                <div className="logo-container">
                  <h2 className="form-title">Sign up</h2>
                  <div className="col-lg-5 col-md-5 px-5 col-sm-12">
                    <Link to="/">
                      <img
                        src={sparklink_logo}
                        alt="Logo"
                        className="sparklink_logo_login"
                      />
                    </Link>
                  </div>
                </div>

                {/* Name Field */}
                <div data-mdb-input-init className="form-outline mb-4">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div data-mdb-input-init className="form-outline mb-4">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="User Name"
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
                <div data-mdb-input-init className="form-outline mb-4">
                  <input
                    type="password"
                    name="pass"
                    id="pass"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Password"
                    required
                  />
                </div>
                {/* Repeat Password Field */}
                <div data-mdb-input-init className="form-outline mb-4">
                  <input
                    type="password"
                    name="re_pass"
                    id="re_pass"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Repeat your password"
                    required
                  />
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
                <div className="text-center text-lg-start mt-4 pt-2">
                  <button
                    type="submit"
                    name="signup"
                    id="signup"
                    className="button_text button-card"
                  >
                    Register
                  </button>
                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
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
              <a href="#" className="signup-image-link">
                I am already a member
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegistrationForm;
