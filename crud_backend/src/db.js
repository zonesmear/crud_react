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

export const query = async (text, params) => {
  try {
    return await db.query(text, params);
  } catch (err) {
    console.error("Database error:", err);
    throw new Error("Database error");  // prevents leaking details
  }
};