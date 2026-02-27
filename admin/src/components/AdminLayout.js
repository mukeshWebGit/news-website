import React from "react";
import { useNavigate } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="min-vh-100 bg-gray-100">
      {/* 🔹 Top Blue Header */}
      <header className="bg-primary text-white flex justify-between items-center px-6 py-3">
        {/* Left: Logo / Title */}
        <h1 className="text-lg font-semibold">News Admin</h1>
        {/* Right: Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-white text-primary font-medium px-4 py-1.5 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </header>

      {/* 🔹 Page Content */}
      <main className="p-6">{children}</main>
    </div>
  );
};

export default AdminLayout;
