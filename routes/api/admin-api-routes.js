const express = require("express")
const pool = require("../../config/database-config")
const router = express.Router()

// Get all admins
router.get("/", async (req, res) => {
  try {
    const query = "SELECT id, email FROM admins"
    const result = await pool.query(query)

    res.json(result.rows)
  } catch (error) {
    console.error("Error fetching admins", error)
    res.status(500).json({ error: "Failed to fetch admins" })
  }
})

// Add Admin POST
router.post("/", async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  try {
    const findQuery = "SELECT * FROM admins WHERE admins.email = $1"
    const findResult = await pool.query(findQuery, [email])

    if (findResult.rowCount > 0) {
      return res.status(400).json({ message: "Admin already exists" })
    }

    const query = "INSERT INTO admins (email) VALUES ($1) RETURNING *"
    const result = await pool.query(query, [email])

    res.json({ message: "Admin access added successfully" })
  } catch (error) {
    console.error("Error adding admin access:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Delete Admin POST
router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const query = "DELETE FROM admins WHERE id = $1"
    const result = await pool.query(query, [id])

    // Access of admin gets deleted, thus the admin gets cascaded, not done yet tho

    if (result.rowCount > 0) {
      res.status(200).json({ message: "Admin deleted successfully" })
    } else {
      res.status(404).json({ message: "Admin not found" })
    }
  } catch (error) {
    console.error("Error deleting admin:", error)
    res.status(500).json({ error: "Failed to delete admin" })
  }
})

module.exports = router
