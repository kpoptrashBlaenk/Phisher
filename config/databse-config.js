const { Pool } = require("pg")
require("dotenv").config()

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_INTERNAL_HOST || process.env.DB_EXTERNAL_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // This can be set to false if you're having issues with self-signed certificates during local development
  },
})

const testConnection = async (attempts = 5) => {
  for (let i = 0; i < attempts; i++) {
    try {
      console.log("Attempting to connect to the database...");
      const res = await pool.query("SELECT NOW()");
      console.log("Connection test successful:", res.rows);
      return; // Exit the function on success
    } catch (error) {
      console.error(`Connection error (attempt ${i + 1}):`, error);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
    }
  }
  console.error("All connection attempts failed.");
};

// Call this function to test the connection
testConnection();



module.exports = pool
