import pool from "../config/database-config"
import axios from "axios"
import { LogContext } from "../types/database"

export const trackingLog = async (context: LogContext) => {
  const response = await axios.get<{ count: number }>(
    `${process.env.HOST || `http://localhost:${process.env.PORT}`}/api/tracking/count/${
      context.userId
    }`
  )
  const count = response.data.count

  const timestamp = new Date().toISOString()
  const query =
    "INSERT INTO tracking_log (user_id, timestamp, page, message, count) VALUES ($1, $2, $3, $4, $5)"

  try {
    await pool.query(query, [context.userId, timestamp, context.page, context.message, count])
    console.log(`Logged to database: User ID: ${context.userId} clicked at ${timestamp}`)
  } catch (error) {
    console.error("Error logging to database:", error)
  }
}
