const { Pool } = require("pg")
require("dotenv").config()

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_INTERNAL_HOST || process.env.DB_EXTERNAL_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
})

const initializeTables = async () => {
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE
    );
  `

  const createTrackingLogTableQuery = `
    CREATE TABLE IF NOT EXISTS tracking_log (
      user_id INTEGER NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `

  const createAdminsTableQuery = `
  CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL UNIQUE
  );
`

  try {
    await pool.query(createUsersTableQuery)
    console.log("Users Table: Done")

    await pool.query(createTrackingLogTableQuery)
    console.log("Tracking Log Table: Done")

    await pool.query(createAdminsTableQuery)
    console.log("Admins Table: Done")
  } catch (error) {
    console.error("Error initializing tables:", error)
  }
}

initializeTables()

module.exports = pool
