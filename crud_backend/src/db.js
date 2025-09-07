import pg from "pg";
import env from "dotenv";

env.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // required for Render
});

pool.on("error", (err) => {
  console.error("Database connection error:", err);
  process.exit(-1);
});

export const query = (text, params) => pool.query(text, params);
