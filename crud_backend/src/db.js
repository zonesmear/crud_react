import pg from "pg";
import env from "dotenv";

env.config();

const pool = new pg.Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: { rejectUnauthorized: false }
});

pool.on("error", (err) => {
  console.error("Database connection error:", err);
  process.exit(-1);
});

export const query = async (text, params) => {
  try {
    return await pool.query(text, params);   // ✅ use pool, not db
  } catch (err) {
    console.error("Database error:", err);
    throw new Error("Database error");
  }
};