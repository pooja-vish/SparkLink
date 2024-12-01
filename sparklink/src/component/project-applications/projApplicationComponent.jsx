import React, { useState, useEffect } from "react";
import axios from "axios";
import "./projApplicationComponent.css";
import MenuComponent from "../menu/MenuComponent";
import MasterComponent from "../MasterComponent";

const ProjApplicationComponent = () => {
  const [acceptedProjects, setAcceptedProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // States for success and error messages
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAccept = async (proj_id, user_id) => {
    console.log(proj_id, user_id);

    try {
      // Send a POST request to the backend API with proj_id, user_id, and role
      setLoading(true);
      const response = await axios.post("/alloc/accept", {
        proj_id,
        user_id,
      });

      if (response.status === 200 || response.status === 201) {
        // Update the state to reflect the accepted project
        fetchNotifications();
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

  const handleReject = async (proj_id, user_id) => {
    console.log(proj_id, user_id);

    try {
      // Send a POST request to the backend API with proj_id, user_id, and role
      setLoading(true);
      const response = await axios.post("/alloc/reject", {
        proj_id,
        user_id,
      });

      if (response.status === 200 || response.status === 201) {
        fetchNotifications();

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

  const handleOkay = async (proj_id, user_id, code) => {
    console.log(proj_id, user_id, code);

    try {
      // Send a POST request to the backend API with proj_id, user_id, and role
      setLoading(true);
      const response = await axios.post("/notify/okay", {
        proj_id,
        user_id,
        code,
      });

      if (response.status === 200 || response.status === 201) {
        console.log("proj_id --> ",proj_id);
        console.log("user_id --> ",user_id);
        console.log("code --> ",code);
        // setNotifications((prevNotifications) =>
        //   prevNotifications.filter(
        //     (notification) =>
        //       notification.proj_id !== proj_id &&
        //       notification.user_id !== user_id &&
        //       notification.code !== code
        //   )
        // );
        fetchNotifications(); 
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

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/notify");
      console.log("APP DATA>>>>>>>>", response.data);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getNotificationMessage = ({
    code,
    user_id,
    user_name,
    proj_id,
    proj_name,
  }) => {
    switch (code) {
      case "BP":
        return (
          <span>
            You successfully created a new project:{" "}
            <a href={`/projects/${proj_id}`}>{proj_name}</a>.
          </span>
        );
      case "BS":
        return (
          <span>
            <a href={`/profile/${user_id}`}>{user_name}</a> has been assigned as
            the supervisor for your project{" "}
            <a href={`/projects/${proj_id}`}>{proj_name}</a>.
          </span>
        );
      case "BT":
        return (
          <span>
            <a href={`/profile/${user_id}`}>{user_name}</a> has been assigned as
            a student for your project{" "}
            <a href={`/projects/${proj_id}`}>{proj_name}</a>.
          </span>
        );
      case "SP":
        return (
          <span>
            You successfully created a new project:{" "}
            <a href={`/projects/${proj_id}`}>{proj_name}</a>.
          </span>
        );
      case "SV":
        return (
          <span>
            You have been assigned as the supervisor for the project{" "}
            <a href={`/projects/${proj_id}`}>{proj_name}</a>.
          </span>
        );
      case "SS":
        return (
          <span>
            <a href={`/profile/${user_id}`}>{user_name}</a> has been assigned as
            the supervisor for your project{" "}
            <a href={`/projects/${proj_id}`}>{proj_name}</a>.
          </span>
        );
      case "SA":
        return (
          <span>
            <a href={`/profile/${user_id}`}>{user_name}</a> has applied for the
            project <a href={`/projects/${proj_id}`}>{proj_name}</a> under your
            supervision.
          </span>
        );
      case "ST":
        return (
          <span>
            <a href={`/profile/${user_id}`}>{user_name}</a> has been assigned as
            a student for your project{" "}
            <a href={`/projects/${proj_id}`}>{proj_name}</a>.
          </span>
        );
      case "TS":
        return (
          <span>
            Your application for the project{" "}
            <a href={`/projects/${proj_id}`}>{proj_name}</a> has been
            successfully submitted.
          </span>
        );
      case "TA":
        return (
          <span>
            Your application for the project{" "}
            <a href={`/projects/${proj_id}`}>{proj_name}</a> has been accepted.
          </span>
        );
      case "TR":
        return (
          <span>
            You have been removed from the project{" "}
            <a href={`/projects/${proj_id}`}>{proj_name}</a> by.
          </span>
        );
      default:
        return <span>Unknown notification code: {code}</span>;
    }
  };

  return (
    <div className="container-fluid">
      <MenuComponent />
      <div className="row">
        <MasterComponent />
        <div className="col-1"></div>
        <div className="col-11">
          <div className="notification-page">
            <h1 className="section-heading">Notifications</h1>
            <div className="notifications-section">
              <div className="notifications-list">
                {notifications.map((notification, index) => (
                  <div className="notification-card" key={index}>
                    <div className="notification-details">
                      <p className="notification-message">
                        {getNotificationMessage(notification)}
                      </p>
                      <p className="notification-timestamp">
                        {new Date(notification.created_on).toLocaleString()}
                      </p>
                    </div>
                    {notification.code === "SA" && (
                      <div className="action-buttons">
                        {acceptedProjects.includes(notification.user_id) ? (
                          <span className="status-accepted">
                            Student Accepted
                          </span>
                        ) : (
                          <button
                            className="btn-accept"
                            onClick={() =>
                              handleAccept(
                                notification.proj_id,
                                notification.user_id
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
                              notification.proj_id,
                              notification.user_id
                            )
                          }
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {notification.code !== "SA" && (
                      <div className="action-buttons">
                        <button
                          className="btn-accept"
                          onClick={() =>
                            handleOkay(
                              notification.proj_id,
                              notification.user_id,
                              notification.code
                            )
                          }
                        >
                          Okay
                        </button>
                      </div>
                    )}
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
