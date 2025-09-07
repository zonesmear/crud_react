import express from "express";
import * as clientController from '../controllers/clientControllers.js';
import cors from "cors";
app.use(cors());
const router = express.Router();

router.get("/clients", clientController.getClients);
router.post("/clients", clientController.addClients);
router.put("/clients/:id", clientController.updateClient);
router.delete("/clients/:id", clientController.deleteClient);
router.get("/clients/search", clientController.searchClients);
export default router;
