import { isLoggedIn, removeToken } from "./auth";

if (!isLoggedIn()) {
  removeToken();
  window.location.href = "/login";
}
