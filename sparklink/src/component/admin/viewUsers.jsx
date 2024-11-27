import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuComponent from "../menu/MenuComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import edit_icon from "../../assets/edit_icon.png";
import delete_icon from "../../assets/delete_icon.png";
import "./viewUsers.css";
import { Modal, Button, Form } from "react-bootstrap";

const roleMapping = {
  1: "Admin",
  2: "Business_Owner",
  3: "Supervisor",
  4: "Student",
};

const reverseRoleMapping = {
  Admin: "1",
  Business_Owner: "2",
  Supervisor: "3",
  Student: "4",
};

const ViewUserComponent = () => {
  const [allUsers, setAllUsers] = useState([]); // Original unfiltered list of users
  const [filteredUsers, setFilteredUsers] = useState([]); // Filtered users for display
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch users from the backend API

  // Function to handle filtering by role
  const filterByRole = (roleName) => {
    if (roleName === "All") {
      setFilteredUsers(allUsers); // Show all users
    } else {
      setFilteredUsers(allUsers.filter((user) => user.roleName === roleName));
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users/allusers");
        const mappedUsers = response.data.map((user) => ({
          ...user,
          roleName: roleMapping[user.role], // Add a readable roleName
          is_active: user.is_active === "Y", // Convert to boolean
        }));
        setAllUsers(mappedUsers); // Store full user list
        setFilteredUsers(mappedUsers); // Initialize filtered list as full list
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser({
      ...user,
      is_active: user.is_active === true, // Ensure boolean value
    });
    setShowModal(true);
  };

  const handleDeleteClick = async (user) => {
    try {
      // Send a PUT request to delete the user
      console.log("entered handle delete click");
      const response = await axios.put(`/api/users/delete/${user.user_id}`);

      // Assuming the API sends back success confirmation
      if (response.status === 200) {
        alert("User successfully deleted!");

        // Optionally, update the UI by removing the user from the state
        setAllUsers((prevUsers) =>
          prevUsers.filter(
            (existingUser) => existingUser.user_id !== user.user_id
          )
        );
      } else {
        alert("Failed to delete the user. Please try again.");
      }
    } catch (error) {
      // Handle any errors that occur
      console.error("Error deleting user:", error);
      alert(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedUser = {
        ...selectedUser,
        role: reverseRoleMapping[selectedUser.roleName], // Convert roleName to role ID
        is_active: selectedUser.is_active ? "Y" : "N", // Convert boolean to "Y"/"N"
      };
      await axios.put(`/api/users/${selectedUser.user_id}`, updatedUser);
      setShowModal(false);
      alert("User updated successfully!");
      // Refresh user list
      const response = await axios.get("/api/users/allusers");
      const mappedUsers = response.data.map((user) => ({
        ...user,
        roleName: roleMapping[user.role],
        is_active: user.is_active === "Y", // Ensure boolean consistency
      }));
      setAllUsers(mappedUsers);
      setFilteredUsers(mappedUsers);

      console.log(response.data.message);
    } catch (err) {
      console.log(err);
      alert(`Error updating user: ${err.message}`);
    }
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="container-fluid mb-5">
          <MenuComponent />
          <div className="usertable">
            <h1>User Management</h1>

            {loading && (
              <p className="text-center text-info">Loading users...</p>
            )}
            {error && <p className="text-center text-danger">Error: {error}</p>}

            {/* User search and filter */}
            <div className="filters text-center my-4">
              <button
                className="btn btn-outline-primary mx-2"
                onClick={() => filterByRole("All")}
              >
                All
              </button>
              <button
                className="btn btn-outline-secondary mx-2"
                onClick={() => filterByRole("Supervisor")}
              >
                Supervisors
              </button>
              <button
                className="btn btn-outline-success mx-2"
                onClick={() => filterByRole("Student")}
              >
                Students
              </button>
              <button
                className="btn btn-outline-warning mx-2"
                onClick={() => filterByRole("Admin")}
              >
                Admins
              </button>
            </div>

            {/* User Table */}
            <div className="usertable table-responsive">
              <table className="table table-bordered table-hover  table-striped ">
                <thead className="thead-dark">
                  <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.user_id}>
                      <td>{user.user_id}</td>
                      <td>{user.username}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.roleName}</td>
                      <td>
                        <img
                          src={edit_icon}
                          className="edit_icon"
                          title="Click to edit Profile Details"
                          alt=""
                          onClick={() => handleEditClick(user)}
                        />
                        <img
                          src={delete_icon}
                          className="delete_icon"
                          title="Click to delete user"
                          alt=""
                          onClick={() => handleDeleteClick(user)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal for editing user */}
            {showModal && (
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="username">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        value={selectedUser.username}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            username: e.target.value,
                          })
                        }
                        disabled
                      />
                    </Form.Group>
                    <Form.Group controlId="name" className="mt-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={selectedUser.name}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            name: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group controlId="email" className="mt-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={selectedUser.email}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            email: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                    <Form.Group controlId="password" className="mt-3">
                      <Form.Label>Password</Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          value={selectedUser.password}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              password: e.target.value,
                            })
                          }
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary ms-2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </Form.Group>
                    <Form.Group controlId="role" className="mt-3">
                      <Form.Label>Role</Form.Label>
                      <Form.Select
                        value={reverseRoleMapping[selectedUser.roleName]}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            roleName: roleMapping[e.target.value],
                          })
                        }
                      >
                        <option value="1">Admin</option>
                        <option value="2">Business Owner</option>
                        <option value="3">Supervisor</option>
                        <option value="4">Student</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="isActive" className="mt-3">
                      <div className="form-check form-switch mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isActiveSwitch"
                          checked={selectedUser.is_active}
                          onChange={(e) =>
                            setSelectedUser({
                              ...selectedUser,
                              is_active: e.target.checked,
                            })
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="isActiveSwitch"
                        >
                          {selectedUser.is_active ? "Active" : "Inactive"}
                        </label>
                      </div>
                    </Form.Group>
                    <div className="mt-4 text-end">
                      <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="primary" className="ms-2">
                        Save Changes
                      </Button>
                    </div>
                  </Form>
                </Modal.Body>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUserComponent;
