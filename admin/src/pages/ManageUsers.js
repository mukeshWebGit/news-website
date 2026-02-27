import React, { useEffect, useState } from "react";
import axios from "axios"; 
import { getToken } from "../utils/auth";
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPasswordField, setShowPasswordField] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser({ ...user, password: "" });
    setShowPasswordField(false);
    const modal = new window.bootstrap.Modal(
      document.getElementById("editUserModal")
    );
    modal.show();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
       // const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setUsers(users.filter((u) => u._id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
     // const token = localStorage.getItem("token");
      const updatedData = {
        name: selectedUser.name,
        email: selectedUser.email,
      };

      // Only include password if entered
      if (showPasswordField && selectedUser.password.trim() !== "") {
        updatedData.password = selectedUser.password;
      }

      await axios.put(
        `http://localhost:5000/api/users/${selectedUser._id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${getToken()}` }, }
      );

      // Update local list
      setUsers(
        users.map((u) => (u._id === selectedUser._id ? { ...u, ...updatedData } : u))
      );

      const modal = window.bootstrap.Modal.getInstance(
        document.getElementById("editUserModal")
      );
      modal.hide();
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Manage Users</h3>
      <table className="table table-bordered align-middle text-center">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th style={{ width: "180px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-muted">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      <div
        className="modal fade"
        id="editUserModal"
        tabIndex="-1"
        aria-labelledby="editUserModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-light">
            <div className="modal-header">
              <h5 className="modal-title" id="editUserModalLabel">
                Edit User
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {selectedUser && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedUser.name}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={selectedUser.email}
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Optional password field */}
                  {!showPasswordField ? (
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      type="button"
                      onClick={() => setShowPasswordField(true)}
                    >
                      Change Password
                    </button>
                  ) : (
                    <div className="mb-3 mt-2">
                      <label className="form-label">New Password (optional)</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter new password"
                        value={selectedUser.password}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
