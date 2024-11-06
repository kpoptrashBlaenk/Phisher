const express = require("express")
const pool = require("../config/database-config")

const router = express.Router()

// Get all users
router.get("/users", async (req, res) => {
  try {
    const query = "SELECT id, name, email FROM users"
    const result = await pool.query(query)

    res.json(result.rows)
  } catch (error) {
    console.error("Error fetching users", error)
    res.status(500).json({ error: "Failed to fetch users" })
  }
})

module.exports = router
