import express, { Request, Response } from "express"
import { getTrackingLogs, getTrackingLogsById } from "./get"
import redirection from "../../../utils/redirection"
import { addTrackingLog } from "./add"

const router = express.Router()

// GET /get -> All Tracking Logs
router.get("/get", async (req: Request, res: Response) => {
  try {
    // Get tracking logs
    const trackingLogs = await getTrackingLogs()

    return res.status(200).json(trackingLogs.rows)
  } catch (error) {
    console.error("Error fetching tracking logs", error)
    return res.status(500).json("Failed to get tracking logs.")
  }
})

// GET /count/:id -> Count logs of this user
router.get("/count/:id", async (req, res) => {
  const { id } = req.params

  try {
    const trackingLogs = await getTrackingLogsById(id)

    return res.status(200).json({ count: trackingLogs.rowCount })
  } catch (error) {
    console.error(`Error fetching tracking logs for user: ${id}`, error)
    return res.status(500).json("Failed to get tracking log count.")
  }
})

// GET /page/:message/:id -> Add tracking log
router.get("/:page/:message/:id", async (req, res) => {
  const { page, message, id } = req.params
  const redirect = redirection("views/redirection.html")

  try {
    // Get trackings logs by id
    const counter = await getTrackingLogsById(id)

    // Check if found
    if (!counter.rowCount) {
      console.error("Error getting tracking log")
      return res.status(404).sendFile(redirect)
    }
    const count = counter.rowCount + 1

    // Timestamp
    const timestamp = new Date().toISOString()

    // Add tracking log
    await addTrackingLog(id, timestamp, page, message, count)

    console.log(`Click registered: User ID: ${id} clicked at ${timestamp}`)
    return res.status(401).sendFile(redirect)
  } catch (error) {
    console.error("Error adding tracking log:", error)
    return res.status(500).sendFile(redirect)
  }
})

export default router
