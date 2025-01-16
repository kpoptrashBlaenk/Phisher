const express = require("express")
const pool = require("../../config/database-config")
const router = express.Router()

// Add User POST
router.post("/", async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  try {
    const result = await pool.query("INSERT INTO users (email) VALUES ($1) RETURNING *", [email])
    res.json({ message: "Admin added successfully" })
  } catch (error) {
    console.error("Error adding admin:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

module.exports = router
