import express, { Request, Response } from "express"
import pool from "../../config/database-config"
import { AdminsRow } from "../../types/database"

const router = express.Router()

// GET / -> All Admins
router.get("/", async (req: Request, res: Response) => {
  try {
    const selectAdminsQuery = `
    SELECT *
    FROM admins
    `

    const selectAdminsResult = await pool.query<AdminsRow>(selectAdminsQuery)

    res.json(selectAdminsResult.rows)
  } catch (error) {
    console.error("Error fetching admins", error)
    res.status(500).json({ error: "Failed to fetch admins" })
  }
})

// POST / -> Add Admin
router.post("/", async (req: Request, res: any) => {
  const { email } = req.body

  // Check if email provided
  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  try {
    const selectAdminsByEmailQuery = `
    SELECT *
    FROM admins
    WHERE admins.email = $1
    `

    const selectAdminsByEmailResult = await pool.query<AdminsRow>(selectAdminsByEmailQuery, [email])

    // Check if admin already exists
    if (selectAdminsByEmailResult.rowCount !== 0) {
      return res.status(400).json({ message: "Admin already exists" })
    }

    const insertAdminsQuery = `
    INSERT INTO admins (email)
    VALUES ($1)
    `

    await pool.query(insertAdminsQuery, [email])

    res.json({ message: "Admin access added successfully" })
  } catch (error) {
    console.error("Error adding admin access:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})

// DELETE /:id -> Delete admin
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const deleteAdminsQuery = `
    DELETE FROM admins
    WHERE id = $1
    `

    await pool.query(deleteAdminsQuery, [id])

    res.status(200).json({ message: "Admin deleted successfully" })
  } catch (error) {
    console.error("Error deleting admin:", error)
    res.status(500).json({ error: "Failed to delete admin" })
  }
})

export default router
