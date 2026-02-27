import React from "react";
import useAuthCheck from "../hooks/useAuthCheck";
export default function Welcome() {
  useAuthCheck();
  return (  
    <div>
      <h2 className="mb-3">Welcome to News Dashboard</h2>
      <p>Use the sidebar to manage articles and users.</p>
    </div>
     
  );
}