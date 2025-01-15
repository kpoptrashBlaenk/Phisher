const pool = require("../config/database-config")

const trackingLog = async (userId) => {
  const timestamp = new Date().toISOString()
  const query = "INSERT INTO tracking_log (user_id, timestamp) VALUES ($1, $2)"

  try {
    await pool.query(query, [userId, timestamp])
    console.log(`Logged to database: User ID: ${userId} clicked at ${timestamp}`)
  } catch (error) {
    console.error("Error logging to database:", error)
  }
}

module.exports = { trackingLog }
