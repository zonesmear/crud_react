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

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...rest } = req.body;

    let updatedData = { ...rest };

    // If password is provided, hash it before sending to service
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedClient = await clientService.updateClient(id, updatedData);

    if (updatedClient) {
      res.status(200).json({ status: "success", data: updatedClient });
    } else {
      res.status(404).json({ status: "error", message: "Client not found" });
    }
  } catch (err) {
    console.error("Error updating client:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
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

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await clientService.findClientByEmail(email);

    if (!client) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email or password" });
    }

    // validate password
    const isMatch = await clientService.validatePassword(
      password,
      client.password
    );

    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email or password" });
    }

    // success
    const { password: _, ...clientData } = client; // remove password from response
    res.status(200).json({
      status: "success",
      message: "Login successful",
      user: clientData,
    });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .json({ status: "error", message: "Server error during login" });
  }
};
