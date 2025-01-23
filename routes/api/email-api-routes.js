require("dotenv").config()
const express = require("express")
const axios = require("axios")
const transporter = require("../../config/email-config")
const emailTemplateBenefits = require("../../templates/email-template-benefits")
const emailTemplatePassword = require("../../templates/email-template-password")
const router = express.Router()

router.post("/", async (req, res) => {
  const { emails, template } = req.body

  if (!emails || emails.length < 1) {
    return res.status(400).json({ message: "No users selected" }) //
  }

  try {
    // Fetch Users
    const response = await axios.post(
      `${process.env.HOST || `http://localhost:${process.env.PORT}`}/api/users/get`,
      { emails: emails }
    )
    const users = response.data

    // If Users
    if (users.length === 0) {
      return res.send("No users to send emails to.")
    }

    // Create Emails
    const errors = []
    const emailPromises = users.map(async (user) => {
      let mailOptions

      switch (template) {
        case "HR Benefits":
          mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: "Phishing Simulation Text",
            html: emailTemplateBenefits(user),
          }
          break
        case "Password Reset":
          mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: "Phishing Simulation Text",
            html: emailTemplatePassword(user),
          }
          break
        default:
          errors.push(`Template not found for ${template}`)
          break
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
