import dotenv from "dotenv"
import pg from "pg"
import queries from "./database-queries.js"
const { Pool } = pg

dotenv.config()

// Database Connection
const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_INTERNAL_HOST || process.env.DB_EXTERNAL_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false,
  },
})

// Create and fill tables
async function initializeTables() {
  try {
    await pool.query(queries.createOUTableQuery)
    console.log("OUs Table: Done")

    await pool.query(queries.createTeamsTableQuery)
    console.log("Teams Table: Done")

    await pool.query(queries.createUsersTableQuery)
    console.log("Users Table: Done")

    await pool.query(queries.createTrackingLogTableQuery)
    console.log("Tracking Log Table: Done")

    await pool.query(queries.createAdminsTableQuery)
    console.log("Admins Table: Done")

    await pool.query(queries.createSentEmailsTableQuery)
    console.log("Emails Table: Done")

    await pool.query(queries.addMyMailAsAdmin, [process.env.ADMIN_ACCESS_EMAIL])
    console.log("Self Access: Done")

    await pool.query(queries.addOUs)
    console.log("Add OUs: Done")

    await pool.query(queries.addTeams)
    console.log("Add Teams: Done")
  } catch (error) {
    console.error("Error initializing tables:", error)
  }
}

initializeTables()

export default pool
