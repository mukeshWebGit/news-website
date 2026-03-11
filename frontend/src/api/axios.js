import axios from "axios";

const api = axios.create({
  baseURL: "https://news-backend-xrtf.onrender.com/api", // backend base URL
  withCredentials: true,
});

export default api;


const API_URL = "https://news-backend-xrtf.onrender.com/api/auth";
export const API_BASE_URL = "https://news-backend-xrtf.onrender.com";

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
