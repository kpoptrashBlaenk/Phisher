import express, { Request, Response } from "express"
import pool from "../../config/database-config"
import { UsersTrackingLogRow } from "../../types/database"

const router = express.Router()

// GET / -> All Tracking Logs
router.get("/", async (req: Request, res: Response) => {
  try {
    const selectTrackingLogUsersQuery = `
      SELECT *
      FROM tracking_log
      JOIN users ON tracking_log.user_id = users.id
      ORDER BY tracking_log.timestamp DESC
      `

    const selectTrackingLogUsersResult = await pool.query<UsersTrackingLogRow>(
      selectTrackingLogUsersQuery
    )

    res.json(selectTrackingLogUsersResult.rows)
  } catch (error) {
    console.error("Error fetching tracking logs", error)
    res.status(500).json({ error: "Failed to fetch tracking logs" })
  }
})

// GET /count/:id -> Count logs of this user
router.get("/count/:id", async (req, res) => {
  const { id } = req.params

  try {
    const selectTrackingLogByUserIdQuery = `
    SELECT *
    FROM tracking_log
    WHERE tracking_log.user_id = $1
    `
    const selectTrackingLogByUserIdResult = await pool.query(selectTrackingLogByUserIdQuery, [id])

    res.json({ count: selectTrackingLogByUserIdResult.rowCount })
  } catch (error) {
    console.error(`Error fetching tracking logs for user: ${id}`, error)
    res.status(500).json({ error: `Error fetching tracking logs for user: ${id}` })
  }
})

export default router
