const express = require("express")
const path = require("path")

const router = express.Router()

// Registration
router.get("/sign", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/sign.html"))
})
module.exports = router
