import React, { useState, useEffect } from "react";
import axios from "axios";
import "./projApplicationComponent.css";
import MenuComponent from "../menu/MenuComponent";
import MasterComponent from '../MasterComponent';

const ProjApplicationComponent = () => {
  const [acceptedProjects, setAcceptedProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);

  // States for success and error messages
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAccept = async (proj_id, user_id, role) => {
    console.log(proj_id, user_id, role);

    try {
      // Send a POST request to the backend API with proj_id, user_id, and role
      setLoading(true);
      const response = await axios.post("/alloc/accept", {
        proj_id,
        user_id,
        role,
      });

      if (response.status === 200 || response.status === 201) {
        // Update the state to reflect the accepted project
        setApplications((prevApplications) =>
          prevApplications.filter(
            (application) => application.proj_id !== proj_id
          )
        );

        setSuccessMessage("Project application accepted successfully!"); // Success message
        setErrorMessage(""); // Clear any previous error message
      } else {
        setErrorMessage("Failed to accept project: " + response.data); // Error message
        setSuccessMessage(""); // Clear any previous success message
      }
    } catch (error) {
      console.error("Error accepting project:", error);
      setErrorMessage("Error accepting project: " + error.message); // Error message
      setSuccessMessage(""); // Clear any previous success message
    } finally {
      setLoading(false); // Hide loading indicator after the operation completes
    }
  };

  const handleReject = async (proj_id, user_id, role) => {
    console.log(proj_id, user_id, role);

    try {
      // Send a POST request to the backend API with proj_id, user_id, and role
      setLoading(true);
      const response = await axios.post("/alloc/reject", {
        proj_id,
        user_id,
        role,
      });

      if (response.status === 200 || response.status === 201) {
        // Update the state to reflect the rejected project
        setApplications((prevApplications) =>
          prevApplications.filter(
            (application) => application.proj_id !== proj_id
          )
        );

        setSuccessMessage("Project application rejected successfully!"); // Success message
        setErrorMessage(""); // Clear any previous error message
      } else {
        setErrorMessage("Failed to reject project: " + response.data); // Error message
        setSuccessMessage(""); // Clear any previous success message
      }
    } catch (error) {
      console.error("Error rejecting project:", error);
      setErrorMessage("Error rejecting project: " + error.message); // Error message
      setSuccessMessage(""); // Clear any previous success message
    } finally {
      setLoading(false); // Hide loading indicator after the operation completes
    }
  };

  const fetchApps = async () => {
    setLoading(true);

    try {
      const response = await axios.get("/apply/getApps");
      console.log("APP DATA>>>>>>>>", response.data);
      setApplications(response.data.applicationData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return (
    <div className="container-fluid">
      <MenuComponent />
      <MasterComponent />
      <div className="row">
        <div className="col-1"></div>
        <div className="col-11">
          <div className="notification-page">
            <h1 className="section-heading">Project Applications </h1>
            <div className="notifications-section">
              <div className="notifications-list">
                {applications.map((application, index) => (
                  <div className="notification-card" key={index}>
                    <div className="notification-details">
                      <p className="notification-message">
                        {application.user.username} applied for{" "}
                        <strong>{application.project.project_name}</strong>
                      </p>
                      <p className="notification-timestamp">
                        {application.modified_on}
                      </p>
                    </div>
                    <div className="action-buttons">
                      {acceptedProjects.includes(application.user.user_id) ? (
                        <span className="status-accepted">
                          Student Accepted
                        </span>
                      ) : (
                        <button
                          className="btn-accept"
                          onClick={() =>
                            handleAccept(
                              application.proj_id,
                              application.user_id,
                              application.role
                            )
                          }
                        >
                          Accept
                        </button>
                      )}
                      <button
                        className="btn-reject"
                        onClick={() =>
                          handleReject(
                            application.proj_id,
                            application.user_id,
                            application.role
                          )
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="message">
                {errorMessage && (
                  <div className="error-message">{errorMessage}</div>
                )}
                {successMessage && (
                  <div className="success-message">{successMessage}</div>
                )}
              </div>
            </div>
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
    </div>
  );
};

export default ProjApplicationComponent;
