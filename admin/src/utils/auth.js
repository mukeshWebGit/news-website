import { jwtDecode } from "jwt-decode";

export const setToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const removeToken = () => localStorage.removeItem("token");

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return false; // if token has no expiry
    return decoded.exp * 1000 < Date.now(); // exp is in seconds
  } catch (error) {
    return true;
  }
};

export const getUser = () => {
  const token = getToken();
  if (!token) return null;

  if (isTokenExpired(token)) {
    removeToken();
    return null;
  }

  try {
    return jwtDecode(token);
  } catch (e) {
    removeToken();
    return null;
  }
};

export const isLoggedIn = () => {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
};
