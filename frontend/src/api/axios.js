import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend base URL
  withCredentials: true,
});

export default api;


const API_URL = "http://localhost:5000/api/auth";
export const API_BASE_URL = "http://localhost:5000";

export const registerUser = async (userData) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const loginUser = async (userData) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return res.json();
};
