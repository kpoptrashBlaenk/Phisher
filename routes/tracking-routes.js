const express = require("express")
const path = require("path")
const { trackingLog } = require("../utils/logger")
const router = express.Router()

router.get("/click", async (req, res) => {
  const { userId } = req.query

  if (userId) {
    await trackingLog(userId)

    res.sendFile(path.join(__dirname, "../views/thank-you-page.html"))
  } else {
    res.status(400).send("User ID missing!")
  }
})

module.exports = router
