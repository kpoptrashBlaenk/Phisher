const express = require("express")
const path = require("path")
const emailTemplatePassword = require("../templates/password/password")
const emailTemplateJobProposition = require("../templates/job-proposition/job-proposition")

const router = express.Router()

const exampleUser = {
  id: "0",
  name_first: "NAME",
}

// Password Reset Template
router.get("/password", async (req, res) => {
  res.setHeader("Content-Type", "text/html")
  res.send(emailTemplatePassword(exampleUser))
})

// Job Proposition Template
router.get("/job_proposition", async (req, res) => {
  res.setHeader("Content-Type", "text/html")
  res.send(emailTemplateJobProposition(exampleUser))
})

module.exports = router
