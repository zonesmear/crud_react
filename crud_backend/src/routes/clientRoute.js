import express from "express";
import * as clientController from '../controllers/clientControllers.js';

const router = express.Router();

router.get("/clients", clientController.getClients);
router.post("/clients", clientController.addClients);
router.put("/clients/:id", clientController.updateClient);
router.delete("/clients/:id", clientController.deleteClient);
router.get("/clients/search", clientController.searchClients);

router.post("/login", clientController.login);
export default router;
