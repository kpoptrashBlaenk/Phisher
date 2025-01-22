const { Pool } = require("pg")
const queries = require("./database-queries.js")
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

module.exports = pool
