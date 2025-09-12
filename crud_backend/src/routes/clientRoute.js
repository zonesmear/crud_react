import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import * as clientController from "../controllers/clientControllers.js";
import * as authControllers from "../controllers/authController.js";

const router = express.Router();

// 🔒 Protected routes (require JWT)
router.get("/clients", verifyToken, clientController.getClients);
router.post("/clients", verifyToken, clientController.addClient);
router.put("/clients/:id", verifyToken, clientController.updateClient);
router.delete("/clients/:id", verifyToken, clientController.deleteClient);
router.get("/clients/search", verifyToken, clientController.searchClients);

// 🔑 Auth routes (no token required for login)
router.post("/login", authControllers.login);

// ✅ Example protected profile route
router.get("/profile", verifyToken, (req, res) => {
  res.json({ status: "success", user: req.user });
});

export default router;
