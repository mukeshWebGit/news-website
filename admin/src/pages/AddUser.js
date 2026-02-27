import React, { useState } from "react";

export default function AddUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
             "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form),
      }); 
      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        alert("✅ User created successfully");
        setForm({ name: "", email: "", password: "", role: "user" });
      } else {
        alert(`⚠️ ${data.message || "Failed to create user"}`);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div>
      <h3 className="mb-3">Add New User</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select
            className="form-select"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Super User</option>
          </select>
        </div>
        <button className="btn btn-success">Create User</button>
      </form>
    </div>
  );
}
