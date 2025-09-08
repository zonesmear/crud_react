import { query } from "../db.js";

export const getClients = async () => {
  try {
    const { rows } = await query("SELECT * FROM clients_tb ORDER BY id ASC");
    return rows;
  } catch (err) {
    console.error("Error fetching clients:", err);
    throw new Error("Database error");
  }
};

export const addClients = async (clientData) => {
  const { name, job, age, email, user_level, isactive } = clientData;

  try {
    // Insert into DB
    const { rows } = await query(
      "INSERT INTO clients_tb (name, job, age, email, user_level, isactive, create_date) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP ) RETURNING *",
      [name, job, age, email, user_level, isactive ?? true ] // default to true
    );

    const newClient = rows[0];

    // Fire webhook (non-blocking)
    fetch("https://n8n-johnas.onrender.com/webhook-test/c98f801f-9318-457e-8d2f-6b5461ed70e4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClient),
    }).catch((err) => console.error("Failed to send to webhook:", err));

    return newClient;
  } catch (err) {
    console.error("Error adding client:", err);
    throw new Error("Database insert failed");
  }
};

export const updateClient = async (id, clientData) => {
  const { name, job, age, email, user_level, isactive } = clientData;

  try {
    const { rows } = await query(
      "UPDATE clients_tb SET name=$1, job=$2, age=$3, email=$4, user_level=$5, isactive=$6 WHERE id=$7 RETURNING *",
      [name, job, age, email, user_level, isactive, id]
    );
    return rows[0];
  } catch (err) {
    console.error("Error updating client:", err);
    throw new Error("Database update failed");
  }
};

export const deleteClient = async (id) => {
  try {
    const { rows } = await query("DELETE FROM clients_tb WHERE id=$1 RETURNING *", [id]);
    return rows[0];
  } catch (err) {
    console.error("Error deleting client:", err);
    throw new Error("Database delete failed");
  }
};

export const searchClients = async (searchTerm) => {
  try {
    const { rows } = await query(
      "SELECT * FROM clients_tb WHERE name ILIKE $1 OR job ILIKE $1 OR email ILIKE $1",
      [`%${searchTerm}%`]
    );
    return rows;
  } catch (err) {
    console.error("Error searching clients:", err);
    throw new Error("Database search failed");
  }
};
