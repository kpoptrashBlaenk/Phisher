const express = require("express")
const fs = require("fs")
const router = express.Router()

const logFilePath = "./tracking.log"

router.get("/click", (req, res) => {
  const { userId } = req.query

  if (userId) {
    const timestamp = new Date().toISOString()
    const logEntry = `User ID: ${userId} clicked at ${timestamp}\n`

    fs.appendFile(logFilePath, logEntry, (err) => {
      if (err) {
        console.error("Error writing to log file:", err)
        return res.status(500).send("Error logging the action")
      }

      console.log(`User ${userId} clicked the button!`)
      res.send(
        `<h1>Thank you for clicking!</h1><p>Your action has been recorded.</p>`
      )
    })
  } else {
    res.status(400).send("User ID missing!")
  }
})

module.exports = router
