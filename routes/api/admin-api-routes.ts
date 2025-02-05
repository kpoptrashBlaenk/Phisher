import express from "express"
import { Request, Response } from "express"
import pool from "../../config/database-config"
import { AdminsRow } from "../../types/database"
const router = express.Router()

// Get all admins
router.get("/", async (req: Request, res: Response) => {
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
router.post("/", async (req: Request, res: any) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  try {
    const findQuery = "SELECT * FROM admins WHERE admins.email = $1"
    const findResult = await pool.query<AdminsRow>(findQuery, [email])

    if (findResult.rowCount && findResult.rowCount > 0) {
      return res.status(400).json({ message: "Admin already exists" })
    }

    const query = "INSERT INTO admins (email) VALUES ($1) RETURNING *"
    await pool.query(query, [email])

    res.json({ message: "Admin access added successfully" })
  } catch (error) {
    console.error("Error adding admin access:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// Delete Admin POST
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const query = "DELETE FROM admins WHERE id = $1"
    await pool.query(query, [id])

    // Access of admin gets deleted, thus the admin gets cascaded, not done yet tho
    res.status(200).json({ message: "Admin deleted successfully" })
  } catch (error) {
    console.error("Error deleting admin:", error)
    res.status(500).json({ error: "Failed to delete admin" })
  }
})

export default router
