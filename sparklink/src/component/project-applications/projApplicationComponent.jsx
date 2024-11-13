import React, { useState, useEffect } from "react";
import axios from "axios";
import "./projApplicationComponent.css";
import MenuComponent from "../menu/MenuComponent";

const ProjApplicationComponent = () => {
  const [acceptedProjects, setAcceptedProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);



  // Function to handle accepting a project
  const handleAccept = async (proj_id, user_id, role) => {
    console.log(proj_id, user_id, role);
    try {
      // Send a POST request to the backend API with proj_id, user_id, and role
      const response = await axios.post("/api/projects/accept", {
        proj_id,
        user_id,
        role,
      });

      if (response.status === 200 || response.status === 201) {
        // Update the state to reflect the accepted project
        setAcceptedProjects((prevAccepted) => [...prevAccepted, proj_id]);
      } else {
        console.error("Failed to accept project:", response.data);
      }
    } catch (error) {
      console.error("Error accepting project:", error);
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
      <div className="row">
        <div className="col-1"></div>
        <div className="col-11">
          <div className="notification-page">
            <h2 className="section-heading">Project Applications </h2>
            <div className="notifications-section">
              <div className="notifications-list">
                {applications.map((application,index) => (
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
                              application.user_id,
                              application.proj_id,
                              application.role
                            )
                          }
                        >
                          Accept
                        </button>
                      )}
                      <button className="btn-reject">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjApplicationComponent;
