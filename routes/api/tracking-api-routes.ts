import express from "express"
import { Request, Response } from "express"
import pool from "../../config/database-config"
const router = express.Router()

// Get all tracking logs
router.get("/", async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT *
      FROM tracking_log
      JOIN users ON tracking_log.user_id = users.id
      ORDER BY tracking_log.timestamp DESC
      `
    const result = await pool.query(query)
    res.json(result.rows)
  } catch (error) {
    console.error("Error fetching tracking logs", error)
    res.status(500).json({ error: "Failed to fetch tracking logs" })
  }
})

// Get counter of this user
router.get("/count/:id", async (req, res) => {
  const { id } = req.params

  try {
    const query = `
    SELECT *
    FROM tracking_log
    WHERE tracking_log.user_id = $1
    `
    const result = await pool.query(query, [id])

    res.json({ count: result.rowCount })
  } catch (error) {
    console.error(`Error fetching tracking logs for user: ${id}`, error)
    res.status(500).json({ error: `Error fetching tracking logs for user: ${id}` })
  }
})

export default router
