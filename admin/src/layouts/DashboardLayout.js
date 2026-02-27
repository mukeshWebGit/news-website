import React from "react";
import {  Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { isLoggedIn, removeToken } from "../utils/auth";

export default function DashboardLayout() {
  const navigate = useNavigate();
  
    const handleLogout = () => {
      if (window.confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
      if (!isLoggedIn()) {
  removeToken();
  window.location.href = "/login";
}
  return (
    <div className="d-flex flex-column min-vh-100 bg-light text-dark">
      {/* Header */}
      <header className="bg-primary py-3 px-4 d-flex justify-content-between align-items-center text-white">
        {/* Left: Logo / Title */}
       <h4 className="m-0">📰 News Admin</h4>
        {/* Right: Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-white text-primary font-medium px-4 py-1.5 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </header>

      {/* Layout */}
      <div className="d-flex flex-grow-1">
       <Sidebar />  

        {/* Main Content */}
        <main className="flex-grow-1 p-4 bg-white overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-light text-center border-top py-2 mt-auto text-secondary">
        © {new Date().getFullYear()} News CMS. All rights reserved.
      </footer>
    </div>
  );
}
