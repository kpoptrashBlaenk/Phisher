require("dotenv").config()
const express = require("express")
const axios = require("axios")
const transporter = require("../config/email-config")
const generateEmailTemplate = require("../templates/email-template")
const router = express.Router()

router.get("/", async (req, res) => {
  try {
    // Fetch Users
    const response = await axios.get(
      `${process.env.HOST || `http://localhost:${process.env.PORT}`}/api/users`
    )
    const users = response.data

    // If Users
    if (users.length === 0) {
      return res.send("No users to send emails to.")
    }

    // Create Emails
    const errors = []
    const emailPromises = users.map(async (user) => {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: user.email,
        subject: "Phishing Simulation Text",
        html: generateEmailTemplate(user),
      }

      // Send Emails
      try {
        await transporter.sendMail(mailOptions)
        console.log(`Email sent to ${user.email}`)
      } catch (error) {
        console.error(`Error sending email to ${user.email}:`, error)
        errors.push(`Error sending email to ${user.email}: ${error.message}`)
      }
    })

    // After all Emails sent => Show which failed
    await Promise.all(emailPromises)

    if (errors.length > 0) {
      res.status(500).send(`Some emails failed to send. Errors: ${errors.join(", ")}`)
    } else {
      res.send(`${users.length} Emails sent to users!`)
    }
  } catch (error) {
    console.error("Error fetching users or sending emails:", error)
    res.status(500).send("An error occurred while sending emails.")
  }
})

module.exports = router
