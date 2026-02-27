export const checkPermission = (action) => (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    if (decoded.role === "super") return next();
    if (decoded.permissions?.[action]) return next();

    return res.status(403).json({ message: "Access denied" });
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
