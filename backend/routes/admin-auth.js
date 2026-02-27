import express from "express";
import { registerUser, loginUser, getAllUsers } from "../controllers/admin-auth.js";
import { verifySuperUser } from "../middleware/admin-auth.js";

const router = express.Router();

// Super admin can create new users
router.post("/register", verifySuperUser, registerUser);

// Login (public)
router.post("/login", loginUser);

// List users (super admin only)
 router.get("/users", verifySuperUser, getAllUsers);


export default router;