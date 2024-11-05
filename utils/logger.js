const pool = require("../config/databse-config")

const trackingLog = async (userId) => {
  const timestamp = new Date().toISOString()
  const action = "button_click"
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
