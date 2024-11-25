import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./LoginComponent.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useAuth } from "../../AuthContext";

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
    console.log("entered login");
    try {
      const response = await axios.post(
        "/api/users/login",
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true, // Include credentials in the request
        }
      );

      // Optionally storing token if your backend returns one
      localStorage.setItem("token", response.data.token);
      setSuccessMessage("Login successful!");
      setErrorMessage("");

      setIsAuthenticated(true);

      setUser(response.data.user);
      // Redirect to the specified URL from the backend response
      const redirectPath = localStorage.getItem("redirectAfterLogin") || "/";

      console.log("the user logged in is redirect to " + redirectPath);

      navigate(redirectPath, { replace: true });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
      setSuccessMessage("");
    }
  };

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample image"
            ></img>
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form className="form" onSubmit={handleLogin}>
              

              <h2 className="form-title">Sign in</h2>

              <div data-mdb-input-init className="form-outline mb-4">
                <input
                  type="email"
                  id="form3Example3"
                  className="email_field form-control form-control-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                />
              </div>

              <div data-mdb-input-init className="form-outline mb-4">
                <input
                  type="password"
                  id="form3Example4"
                  className="password_field form-control form-control-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                />
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div className="form-check mb-0">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    value=""
                    id="form2Example3"
                  />
                  <label className="form-check-label" for="form2Example3">
                    Remember me
                  </label>
                </div>
                <a href="/reset-password-email" className="text-body">
                  Forgot password?
                </a>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  type="submit" 
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="btn btn-primary btn-lg"
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                >
                  Login
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  Don't have an account?{" "}
                  <a href="/register" className="link-danger">
                    Register
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
        <div className="text-white mb-3 mb-md-0">
          Copyright © 2020. All rights reserved.
        </div>

        <div>
          <a href="#!" className="text-white me-4">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#!" className="text-white me-4">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#!" className="text-white me-4">
            <i className="fab fa-google"></i>
          </a>
          <a href="#!" className="text-white">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default LoginComponent;
