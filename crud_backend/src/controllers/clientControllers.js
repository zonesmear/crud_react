import jwt from "jsonwebtoken";
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
    const { name, email, password, ...rest } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        status: "error", 
        message: "Name, Email and Password are required" 
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newClient = await clientService.addClients({
      name,
      email,
      password: hashedPassword,
      ...rest,
    });

    res.status(201).json({ status: "success", data: newClient });
  } catch (err) {
    console.error("Error adding client:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...rest } = req.body;

    let updatedData = { ...rest };

    // If password is provided, hash it before sending to service
   if (password && password.trim() !== "") {
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


export const loginClient = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "Email and password are required" });
  }

  try {
    const user = await clientService.loginClient(email, password);

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid credentials" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: "success",
      user,
      token,
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res
      .status(500)
      .json({ status: "error", message: "Internal Server Error" });
  }
};
