const fs = require("fs")
const logFilePath = "./tracking.log"
const pool = require("../config/databse-config")

const trackingLog = async (userId) => {
  const timestamp = new Date().toISOString()
  const logEntry = `User ID: ${userId} clicked at ${timestamp}\n`

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error("Error writing to log file:", err)
      return res.status(500).send("Error logging the action")
    }
  })

  const query =
    "INSERT INTO tracking_log (user_id, action, timestamp) VALUES ($1, $2, $3)"
  try {
    await pool.query(query, [userId, action, timestamp])
    console.log(
      `Logged to database: User ID: ${userId} clicked at ${timestamp}`
    )
  } catch (error) {
    console.error("Error logging to database:", error)
  }
}

module.exports = { trackingLog }
