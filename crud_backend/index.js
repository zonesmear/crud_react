import express from "express";
import cors from "cors";
import "dotenv/config";
import pkg from "pg";
import clientRoutes from "./src/routes/clientRoute.js";

const { Pool } = pkg;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Render requires SSL
  },
});

// Express app
const app = express();
const port = process.env.PORT || 3000; // Render will provide PORT

app.use(cors());
app.use(express.json());

// Routes
app.use("/api", clientRoutes);

// Start server
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});

// Export pool if needed in routes
export default pool;
