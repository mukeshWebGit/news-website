import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Check if user is logged in (has valid token)
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer TOKEN"
    if (!token) return res.status(401).json({ message: "No token provided" });

    // ✅ Use the same secret as used during token creation
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });

    next();
  } catch (err) {
    console.error("protect error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// ✅ Only super user can access
export const superOnly = (req, res, next) => {
  if (req.user.role !== "super") {
    return res.status(403).json({ message: "Access denied: Super user only" });
  }
  next();
};

// ✅ Verify Super User via token directly
export const verifySuperUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "super") {
      return res.status(403).json({ message: "Access denied: Super user only" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Token verification error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

