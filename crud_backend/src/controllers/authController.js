import * as clientService from "../services/clientServices.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // put in .env

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await clientService.findByEmail(email);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    // Compare password (bcrypt if hashed)
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ status: "error", message: "Invalid password" });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      status: "success",
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Login failed" });
  }
};
