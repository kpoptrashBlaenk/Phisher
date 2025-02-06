import pool from "../config/database-config"
import axios from "axios"
import { LogContext } from "../types/database"

// Logger that each link uses
async function trackingLog(context: LogContext) {
  // Count how many times this person logged
  const response = await axios.get<{ count: number }>(
    `${process.env.HOST || `http://localhost:${process.env.PORT}`}/api/tracking/count/${context.userId}`
  )
  const count = response.data.count + 1

  // Timestamp
  const timestamp = new Date().toISOString()

  try {
    // Insert log
    const insertTrackingLogQuery = `
    INSERT INTO tracking_log (user_id, timestamp, page, message, count)
    VALUES ($1, $2, $3, $4, $5)
    `

    await pool.query(insertTrackingLogQuery, [context.userId, timestamp, context.page, context.message, count])

    console.log(`Logged to database: User ID: ${context.userId} clicked at ${timestamp}`)
  } catch (error) {
    console.error("Error logging to database:", error)
  }
}

export default trackingLog
