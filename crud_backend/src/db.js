import pg from "pg";
import env from "dotenv";

env.config();
const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // required on Render
});

db.connect();

db.connect();
db.on ("error", (err) => {
    console.error("Database connection error:", err);
    process.exit(-1);
}   );

export const query = (text, params) => db.query(text, params);  