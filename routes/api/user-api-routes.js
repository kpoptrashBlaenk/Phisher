const express = require("express")
const pool = require("../../config/database-config")
const router = express.Router()

// Get all users
router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM users NATURAL JOIN teams NATURAL JOIN ous ORDER BY users.name_last ASC"
    const result = await pool.query(query)

    res.json(result.rows)
  } catch (error) {
    console.error("Error fetching users", error)
    res.status(500).json({ error: "Failed to fetch users" })
  }
})

// Get some users
router.post("/get", async (req, res) => {
  const { emails } = req.body

  if (!emails || emails.length < 1) {
    return res.status(400).json({ message: "No emails provided" })
  }

  // Get users that include from emails
  try {
    const query = "SELECT id, email FROM users WHERE users.email = ANY($1)"

    const result = await pool.query(query, [emails])

    return res.json(result.rows)
  } catch (error) {
    console.error("Error fetching users", error)
    return res.status(500).json({ error: "Failed to fetch users" })
  }
})

// Add User POST
router.post("/", async (req, res) => {
  const { lastName, firstName, email, team } = req.body
  if (!lastName) {
    return res.status(400).json({ message: "Last name is required" })
  }

  if (!firstName) {
    return res.status(400).json({ message: "First name is required" })
  }

  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  if (!team) {
    return res.status(400).json({ message: "Team is required" })
  }

  try {
    const teamId = await pool.query("SELECT id FROM teams WHERE teams.team = $1", [team])

    if (!teamId.rowCount > 0) {
      return res.status(400).json({ message: "Team not found" })
    }

    const result = await pool.query(
      "INSERT INTO users (name_last, name_first, email, team_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [lastName, firstName, email, teamId.rows[0].id]
    )
    res.json({ message: "User added successfully" })
  } catch (error) {
    console.error("Error adding user:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Delete User POST
router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const query = "DELETE FROM users WHERE id = $1"
    const result = await pool.query(query, [id])

    if (result.rowCount > 0) {
      res.status(200).json({ message: "User deleted successfully" })
    } else {
      res.status(404).json({ message: "User not found" })
    }
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({ error: "Failed to delete user" })
  }
})

// Get all teams
router.get("/teams", async (req, res) => {
  try {
    const query = "SELECT team FROM teams ORDER BY team ASC"
    const result = await pool.query(query)

    res.json(result.rows)
  } catch (error) {
    console.error("Error fetching teams", error)
    res.status(500).json({ error: "Failed to fetch teams" })
  }
})

module.exports = router
