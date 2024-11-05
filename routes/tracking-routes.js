const express = require("express")
const path = require("path")
const { trackingLog } = require("../utils/logger")
const router = express.Router()

router.get("/click", (req, res) => {
  const { userId } = req.query

  if (userId) {
    console.log(`User ${userId} clicked the button!`)
    trackingLog(userId)

    res.sendFile(path.join(__dirname, "../views/thank-you-page.html"))
  } else {
    res.status(400).send("User ID missing!")
  }
})

module.exports = router
