const express = require("express")
const path = require("path")
const emailTemplatePassword = require("../templates/email-template-password")

const router = express.Router()

const exampleUser = {
  id: "0",
  name: "NAME",
}

// Password Reset Template
router.get("/password", async (req, res) => {
  res.setHeader("Content-Type", "text/html")
  res.send(emailTemplatePassword(exampleUser))
})

module.exports = router
