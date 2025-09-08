import { query } from "../db.js";

/**
 * Get all clients.
 * @returns {Promise<Array>}
 */
export const getClients = async () => {
  try {
    const { rows } = await query("SELECT * FROM clients_tb ORDER BY id ASC");
    return rows;
  } catch (err) {
    console.error("Error fetching clients:", err);
    throw new Error("Failed to fetch clients from database.");
  }
};

/**
 * Add a new client.
 * @param {Object} clientData
 * @returns {Promise<Object>}
 */
export const addClients = async (clientData) => {
  const { name, job, age, email, user_level, isactive } = clientData;

  if (!name || !job || !email) {
    throw new Error("Missing required fields: name, job, or email.");
  }

  try {
    const { rows } = await query(
      `INSERT INTO clients_tb (name, job, age, email, user_level, isactive, create_date)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       RETURNING *`,
      [name, job, age, email, user_level, isactive ?? true]
    );

    const newClient = rows[0];

    // Fire webhook (non-blocking)
    const webhookUrl = process.env.WEBHOOK_URL ||
      "https://n8n-johnas.onrender.com/webhook-test/c98f801f-9318-457e-8d2f-6b5461ed70e4";
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClient),
    }).catch((err) => console.error("Failed to send to webhook:", err.message));

    return newClient;
  } catch (err) {
    console.error("Error adding client:", err);
    throw new Error("Failed to add client to database.");
  }
};

/**
 * Update a client by ID.
 * @param {number} id
 * @param {Object} clientData
 * @returns {Promise<Object>}
 */
export const updateClient = async (id, clientData) => {
  const { name, job, age, email, user_level, isactive } = clientData;

  try {
    const { rows } = await query(
      `UPDATE clients_tb
       SET name=$1, job=$2, age=$3, email=$4, user_level=$5 isactive=$6
       WHERE id=$7 RETURNING *`,
      [name, job, age, email, user_level, isactive, id]
    );
    if (!rows[0]) throw new Error("Client not found.");
    return rows[0];
  } catch (err) {
    console.error("Error updating client:", err);
    throw new Error("Failed to update client.");
  }
};

/**
 * Delete a client by ID.
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const deleteClient = async (id) => {
  try {
    const { rows } = await query(
      "DELETE FROM clients_tb WHERE id=$1 RETURNING *",
      [id]
    );
    if (!rows[0]) throw new Error("Client not found.");
    return rows[0];
  } catch (err) {
    console.error("Error deleting client:", err);
    throw new Error("Failed to delete client.");
  }
};

/**
 * Search clients by term.
 * @param {string} searchTerm
 * @returns {Promise<Array>}
 */
export const searchClients = async (searchTerm) => {
  try {
    const { rows } = await query(
      `SELECT * FROM clients_tb
       WHERE name ILIKE $1 OR job ILIKE $1 OR email ILIKE $1 OR user_level ILIKE $1`,
      [`%${searchTerm}%`]
    );
    return rows;
  } catch (err) {
    console.error("Error searching clients:", err);
    throw new Error("Failed to search clients.");
  }
};