import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getClients, addClients, updateClient, deleteClient, searchClients } from "../controllers/clientControllers.js";
import { login } from "../controllers/authController.js";

const router = express.Router();

// 🔒 Protected routes (require JWT)
router.get("/clients", verifyToken, getClients);
router.post("/clients", verifyToken, addClients);
router.put("/clients/:id", verifyToken, updateClient);
router.delete("/clients/:id", verifyToken, deleteClient);
router.get("/clients/search", verifyToken, searchClients);

// 🔑 Auth routes
router.post("/login", login);

// ✅ Example protected profile route
router.get("/profile", verifyToken, (req, res) => {
  res.json({ status: "success", user: req.user });
});

export default router;
