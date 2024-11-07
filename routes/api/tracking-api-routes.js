const express = require("express")
const pool = require("../../config/database-config")
const router = express.Router()

// Get all tracking logs
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT tracking_log.user_id, tracking_log.timestamp, users.name, users.email
      FROM tracking_log
      JOIN users ON tracking_log.user_id = users.id
      `
    const result = await pool.query(query)
    res.json(result.rows)
  } catch (error) {
    console.error("Error fetching tracking logs", error)
    res.status(500).json({ error: "Failed to fetch tracking logs" })
  }
})

module.exports = router
