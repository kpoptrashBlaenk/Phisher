const express = require("express")
const path = require("path")
const router = express.Router()
const { trackingLog } = require("../../utils/logger")

const page = "Password Reset"
const redirection = path.join(__dirname, "../../views/redirection.html")

// Open Image
router.get("/image", async (req, res) => {
  const { userId } = req.query

  if (userId) {
    const context = {
      userId: userId,
      page: page,
      message: "Opened image",
    }

    await trackingLog(context)

    res.sendFile(redirection)
  } else {
    res.status(400).send("User ID missing!")
  }
})

// Open Profile
router.get("/profile", async (req, res) => {
  const { userId } = req.query

  if (userId) {
    const context = {
      userId: userId,
      page: page,
      message: "Opened profile",
    }

    await trackingLog(context)

    res.sendFile(redirection)
  } else {
    res.status(400).send("User ID missing!")
  }
})

// Open Support
router.get("/support", async (req, res) => {
  const { userId } = req.query

  if (userId) {
    const context = {
      userId: userId,
      page: page,
      message: "Opened support",
    }

    await trackingLog(context)

    res.sendFile(redirection)
  } else {
    res.status(400).send("User ID missing!")
  }
})

module.exports = router
