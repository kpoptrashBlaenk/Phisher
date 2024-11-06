const express = require("express")
const path = require("path")
const pool = require("../config/database-config")

const router = express.Router()

// Main Interface
router.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/interface.html"))
})

module.exports = router
