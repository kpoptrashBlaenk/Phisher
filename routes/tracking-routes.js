const express = require("express")
const path = require("path")
const { trackingLog } = require("../utils/logger")
const router = express.Router()

router.get("/click", (req, res) => {
  const { userEmail } = req.query

  if (userEmail) {
    console.log(`User ${userEmail} clicked the button!`)
    trackingLog(userEmail)

    res.sendFile(path.join(__dirname, "../views/thank-you-page.html"))
  } else {
    res.status(400).send("User ID missing!")
  }
})

module.exports = router
