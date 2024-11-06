const express = require("express")
const path = require("path")
const pool = require("../config/database-config")

const router = express.Router()

// Main Interface
router.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/interface.html"))
})

// Add User POST
router.post("/add-user", async (req, res) => {
  const { name, email } = req.body
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" })
  }

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    )
    res.json({ message: "User added successfully", user: result.rows[0] })
  } catch (error) {
    console.error("Error adding user:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router
