import React from "react";   
import { Link } from "react-router-dom";
import { getUser } from "../utils/auth";
export default function Sidebar() {
  const user = getUser();
  const isSuperAdmin = user?.role === "super";

    return (
        <>
        
         {/* Sidebar */}
        <nav className="bg-white border-end shadow-sm p-3"style={{ width: "240px" }} >
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <Link to="/dashboard" className="nav-link text-dark active">
                <i className="bi bi-speedometer2 me-2"></i> Dashboard
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/add-article" className="nav-link text-dark">
                <i className="bi bi-plus-circle me-2"></i> Add Article
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link
                to="/manage-articles"
                className="nav-link text-dark"
              >
                <i className="bi bi-file-earmark-text me-2"></i> Manage Articles
              </Link>
            </li>
              {/* 🔥 ONLY SHOW IF SUPER ADMIN */}
        {isSuperAdmin && (
          <>
            <li className="nav-item mb-2">
              <Link to="/add-user" className="nav-link text-dark">
                <i className="bi bi-person-plus me-2"></i> Add User
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/manage-users" className="nav-link text-dark">
                <i className="bi bi-people me-2"></i> Manage Users
              </Link>
            </li>
            </>
        )}
          </ul>
        </nav>
        </>
    );
}

(function() {
    function updateActive() {
        var path = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
        document.querySelectorAll('.nav-link').forEach(function(a){
            var href = (a.getAttribute('href') || '').replace(/\/+$/, '') || '/';
            if (href === path) a.classList.add('active');
            else a.classList.remove('active');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateActive);
    } else {
        updateActive();
    }

    window.addEventListener('popstate', updateActive);

    document.addEventListener('click', function(e){
        var a = e.target.closest('.nav-link');
        if (!a) return;
        // allow react-router to update the URL first
        setTimeout(updateActive, 10);
    });
})();