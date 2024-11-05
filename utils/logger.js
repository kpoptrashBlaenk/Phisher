const fs = require("fs")
const logFilePath = "./tracking.log"

const trackingLog = (userId) => {
  const timestamp = new Date().toISOString()
  const logEntry = `User ID: ${userId} clicked at ${timestamp}\n`

  {
    fs.appendFile(logFilePath, logEntry, (err) => {
      if (err) {
        console.error("Error writing to log file:", err)
        return res.status(500).send("Error logging the action")
      }
    })
  }
}

module.exports = { trackingLog }
