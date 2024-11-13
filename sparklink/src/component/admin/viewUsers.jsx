import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuComponent from '../menu/MenuComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import './viewUsers.css'
import { Modal, Button, Form } from 'react-bootstrap';


const roleMapping = {
  "1": "Admin",
  "2": "Supervisor",
  "3": "Student",
};

const reverseRoleMapping = {
  "Admin": "1",
  "Supervisor": "2",
  "Student": "3",
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
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users/allusers');
        const mappedUsers = response.data.map(user => ({
          ...user,
          roleName: roleMapping[user.role], // Add a readable roleName
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

  // Function to handle filtering by role
  const filterByRole = (roleName) => {
    if (roleName === "All") {
      setFilteredUsers(allUsers); // Show all users
    } else {
      setFilteredUsers(allUsers.filter(user => user.roleName === roleName));
    }
  };

  const handleEditClick = (user)=>{
    setSelectedUser(user);
    setShowModal(true);
  
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedUser = {
        ...selectedUser,
        role: reverseRoleMapping[selectedUser.roleName],
      };
      await axios.put(`/api/users/${selectedUser.user_id}`, updatedUser);
      setShowModal(false);
      alert('User updated successfully!');
      // Refresh user list
      const response = await axios.get('/api/users/allusers');
      const mappedUsers = response.data.map(user => ({
        ...user,
        roleName: roleMapping[user.role],
      }));
      setAllUsers(mappedUsers);
      setFilteredUsers(mappedUsers);
    } catch (err) {
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

        {loading && <p className='text-center text-info'>Loading users...</p>}
        {error && <p className='text-center text-danger'>Error: {error}</p>}

        {/* User search and filter */}
        
        <div className="filters text-center my-4">
          <button className='btn btn-outline-primary mx-2' onClick={() => filterByRole("All")}>All</button>
          <button className='btn btn-outline-secondary mx-2' onClick={() => filterByRole("Supervisor")}>Supervisors</button>
          <button className='btn btn-outline-success mx-2' onClick={() => filterByRole("Student")}>Students</button>
          <button className='btn btn-outline-warning mx-2' onClick={() => filterByRole("Admin")}>Admins</button>
        </div>
        
        {/* User Table */}
        <div className="usertable table-responsive">
          <table className='table table-bordered table-hover'>
            <thead className='thead-dark'>
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
              {filteredUsers.map(user => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.roleName}</td>
                  
                  <td>
                  <button className="btn btn-sm btn-primary mx-1" onClick={()=>handleEditClick(user)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        { showModal && (
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
                  onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="name" className="mt-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="email" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="password" className="mt-3">
              <Form.Label>Password</Form.Label>
              <div className="d-flex align-items-center">
              <Form.Control
            type={showPassword ? "text" : "password"} // Toggle between "text" and "password"
            value={selectedUser.password}
            onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                      />
                    <button
                                type="button"
                        className="btn btn-sm btn-outline-secondary ms-2"
                          onClick={() => setShowPassword(!showPassword)} // Toggle the state
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
                    setSelectedUser({ ...selectedUser, roleName: roleMapping[e.target.value] })
                  }
                >
                  <option value="1">Admin</option>
                  <option value="2">Supervisor</option>
                  <option value="3">Student</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="isActive" className="mt-3">
  <Form.Label>Is Active</Form.Label>
  <div className="form-check form-switch mt-2">
    <input
      className="form-check-input"
      type="checkbox"
      id="isActiveSwitch"
      checked={selectedUser.is_active}
      onChange={(e) =>
        setSelectedUser({ ...selectedUser, is_active: e.target.checked })
      }
    />
    <label className="form-check-label" htmlFor="isActiveSwitch">
      {selectedUser.is_active ? "Active" : "Inactive"}
    </label>
  </div>
</Form.Group>
              <div className="mt-4 text-end">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
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