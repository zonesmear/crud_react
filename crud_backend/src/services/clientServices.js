import { query } from "../db.js";

export const getClients = async() => {
    const {rows} = await query("SELECT * FROM clients_tb");
    return rows;
}

export const addClients = async (clientData) => {
  const { name, job, age, email, isactive } = clientData;

  // Insert into database
  const { rows } = await query(
    "INSERT INTO clients_tb (name, job, age, email, isactive) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, job, age, email, isactive]
  );

  const newClient = rows[0];

  // Send to webhook
  try {
    await fetch('https://n8n-johnas.onrender.com/webhook-test/c98f801f-9318-457e-8d2f-6b5461ed70e4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClient)
    });
  } catch (err) {
    console.error('Failed to send to webhook:', err);
  }

  return newClient;
};


export const updateClient = async (id, clientData) => {
    const {name, job, age, email, isactive} = clientData;
    const {rows} = await query(
        "UPDATE clients_tb SET name=$1, job=$2, age=$3, email=$4, isactive=$5 WHERE id=$6 RETURNING *",
        [name, job, age, email, isactive, id]
    );
    return rows[0];
}

export const deleteClient = async (id) => {
    const {rows} = await query(
        "DELETE FROM clients_tb WHERE id=$1 RETURNING *",
        [id]
    );
    return rows[0];
}

export const searchClients = async (searchTerm) => {
    const {rows} = await query(
        "SELECT * FROM clients_tb WHERE name ILIKE $1 OR job ILIKE $1 OR email ILIKE $1",
        [`%${searchTerm}%`]
    );
    return rows;
}