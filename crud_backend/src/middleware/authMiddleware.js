import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(403).json({ status: "error", message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ status: "error", message: "Invalid token" });

    req.user = decoded; // attach user info
    next();
  });
};
