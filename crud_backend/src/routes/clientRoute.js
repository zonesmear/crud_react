import express from "express";
import * as clientController from '../controllers/clientControllers.js';
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/clients", clientController.getClients);
router.post("/clients", clientController.addClients);
router.put("/clients/:id", clientController.updateClient);
router.delete("/clients/:id", clientController.deleteClient);
router.get("/clients/search", clientController.searchClients);

router.post("/login", clientController.loginClient);
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ status: "success", user: req.user });
});
export default router;
