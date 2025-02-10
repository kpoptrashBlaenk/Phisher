import express, { Request, Response } from "express"
import { getTrackingLogs, getTrackingLogsById } from "./get"

const router = express.Router()

// GET / -> All Tracking Logs
router.get("/", async (req: Request, res: Response) => {
  try {
    // Get tracking logs
    const trackingLogs = await getTrackingLogs()

    return res.status(200).json(trackingLogs.rows)
  } catch (error) {
    console.error("Error fetching tracking logs", error)
    res.status(500).json("Failed to get tracking logs.")
  }
})

// GET /count/:id -> Count logs of this user
router.get("/count/:id", async (req, res) => {
  const { id } = req.params

  try {
    const trackingLogs = await getTrackingLogsById(id)

    res.status(200).json({ count: trackingLogs.rowCount })
  } catch (error) {
    console.error(`Error fetching tracking logs for user: ${id}`, error)
    res.status(500).json("Failed to get tracking log count.")
  }
})

export default router