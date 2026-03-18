import jwt from "jsonwebtoken";

// Middleware to protect routes
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // "Bearer <token>"
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Invalid token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach decoded user ID
    req.user = { id: decoded.id || decoded._id };

    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(403).json({ message: "Unauthorized" });
  }
};
