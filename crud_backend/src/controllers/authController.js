import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js"; // your DB connection
import dotenv from "dotenv";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY; 

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = "SELECT * FROM clients_tb WHERE email = $1";
    const result = await db.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ status: "error", message: "User not found" });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ status: "error", message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ status: "success", message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
