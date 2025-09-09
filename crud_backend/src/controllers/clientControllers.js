import * as clientService from "../services/clientServices.js";
import bcrypt from "bcrypt";
export const getClients = async (req, res) => {
  try {
    const clients = await clientService.getClients();
    res.status(200).json({ status: 'success', data: clients });
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({ status: 'error', message: "Internal Server Error" });
  }
};

export const addClients = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ status: 'error', message: "Name and Email are required" });
    }

    const newClient = await clientService.addClients(req.body);
    res.status(201).json({ status: 'success', data: newClient });
  } catch (err) {
    console.error("Error adding client:", err);
    res.status(500).json({ status: 'error', message: "Internal Server Error" });
  }
};

export const updateClient = async (id, clientData) => {
  const { name, job, age, email, user_level, password, isactive } = clientData;

  try {
    let queryText, values;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      queryText = `
        UPDATE clients_tb 
        SET name=$1, job=$2, age=$3, email=$4, user_level=$5, password=$6, isactive=$7
        WHERE id=$8 RETURNING *
      `;
      values = [name, job, age, email, user_level, hashedPassword, isactive, id];
    } else {
      queryText = `
        UPDATE clients_tb 
        SET name=$1, job=$2, age=$3, email=$4, user_level=$5, isactive=$6
        WHERE id=$7 RETURNING *
      `;
      values = [name, job, age, email, user_level, isactive, id];
    }

    const { rows } = await query(queryText, values);
    return rows[0];
  } catch (err) {
    console.error("Error updating client:", err);
    throw new Error("Database update failed");
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClient = await clientService.deleteClient(id);
    if (deletedClient) {
      res.status(200).json({ status: 'success', data: deletedClient });
    } else {
      res.status(404).json({ status: 'error', message: "Client not found" });
    }
  } catch (err) {
    console.error("Error deleting client:", err);
    res.status(500).json({ status: 'error', message: "Internal Server Error" });
  }
};

export const searchClients = async (req, res) => {
  try {
    const { q } = req.query;
    const results = await clientService.searchClients(q);
    res.status(200).json({ status: 'success', data: results });
  } catch (err) {
    console.error("Error searching clients:", err);
    res.status(500).json({ status: 'error', message: "Internal Server Error" });
  }
};
