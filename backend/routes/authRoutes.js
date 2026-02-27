import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
} from "../controllers/admin-auth.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// RESTful routes
router.post("/register", registerUser); // POST /api/auth/register
router.post("/login", loginUser);       // POST /api/auth/login
router.get("/me", protect, getProfile); // GET  /api/auth/me

export default router;
