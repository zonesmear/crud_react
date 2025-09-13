import { query } from "../db.js";
import bcrypt from "bcrypt";

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
  const { name, job, age, email, password, user_level, isactive } = clientData;

  try {
    // Insert into DB
    const { rows } = await query(
      "INSERT INTO clients_tb (name, job, age, email, password, user_level, isactive, create_date) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP ) RETURNING *",
      [name, job, age, email, password, user_level, isactive ?? true ] // default to true
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
  const { name, job, age, email, user_level, password, isactive } = clientData;

  try {
    let queryText;
    let values;

    if (password && password.trim() !== "") {
      // 🔑 Password provided → include in update
      queryText = `
        UPDATE clients_tb 
        SET name=$1, job=$2, age=$3, email=$4, user_level=$5, password=$6, isactive=$7
        WHERE id=$8 RETURNING *`;
      values = [name, job, age, email, user_level, password, isactive, id];
    } else {
      // 🚫 No password provided → exclude from update
      queryText = `
        UPDATE clients_tb 
        SET name=$1, job=$2, age=$3, email=$4, user_level=$5, isactive=$6
        WHERE id=$7 RETURNING *`;
      values = [name, job, age, email, user_level, isactive, id];
    }

    const { rows } = await query(queryText, values);
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



export const findClientByEmail = async (email) => {
  try {
    const { rows } = await query("SELECT * FROM clients_tb WHERE email = $1", [
      email,
    ]);
    return rows[0];
  } catch (err) {
    console.error("Error finding client:", err);
    throw new Error("Database query failed");
  }
};

export const validatePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const loginClient = async (email, password) => {
  try {
    const { rows } = await query("SELECT * FROM clients_tb WHERE email=$1", [email]);
    const client = rows[0];

    if (!client) {
      return null; // email not found
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return null; // wrong password
    }

    // remove password before returning user
    const { password: _, ...safeUser } = client;
    return safeUser;
  } catch (err) {
    console.error("Error during login:", err);
    throw new Error("Database login failed");
  }
};