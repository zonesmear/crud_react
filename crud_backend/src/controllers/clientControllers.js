import * as clientService from "../services/clientServices.js";
export const getClients = async (req, res) => {
    try {
        const clients = await clientService.getClients();
        res.status(200).json(clients);
    } catch (err) {
        console.error("Error fetching clients:", error);
        res.status(500).json({ error: "Internal Server Error"})
    }};

export const addClients = async (req, res) => {
  try {
    const newClient = await clientService.addClients(req.body);
    res.status(201).json({ status: 'success', data: newClient });
  } catch (err) {
    console.error("Error adding client:", err);
    res.status(500).json({ status: 'error', message: "Internal Server Error" });
  }
};
export const updateClient = async (req, res) => {
    try {
        const {id} = req.params;
        const updatedClient = await clientService.updateClient(id, req.body);
        if (updatedClient) {
            res.status(200).json(updatedClient);
        } else {
            res.status(404).json({ error: "Client not found"});
        }
    } catch (error) {
        console.error("Error updating client:", error);
        res.status(500).json({ error: "Internal Server Error"})
    }
};
export const deleteClient = async (req, res) => {
    try {
        const {id} = req.params;   
        const deletedClient = await clientService.deleteClient(id);
        if (deletedClient) {
            res.status(200).json(deletedClient);
        } else {
            res.status(404).json({ error: "Client not found"});
        }
    } catch (error) {
        console.error("Error deleting client:", error);
        res.status(500).json({ error: "Internal Server Error"})
    }   
};
export const searchClients = async (req, res) => {
    try {
        const {q} = req.query;
        const results = await clientService.searchClients(q);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error searching clients:", error);
        res.status(500).json({ error: "Internal Server Error"})
    }
};