import * as clientService from "../services/clientServices.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const loginClient = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await clientService.loginClient(email, password); // ✅ use loginClient
    if (!user) {
      return res.status(401).json({ status: "error", message: "Invalid email or password" });
    }

    // create token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      status: "success",
      token,
      user
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ status: "error", message: "Login failed" });
  }
};
