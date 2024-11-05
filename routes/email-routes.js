const express = require("express")
const transporter = require("../config/email-config")
const generateEmailTemplate = require("../templates/email-template")

const router = express.Router()

const users = [{ id: 1, name: "Aldin", email: "aldinmusik@gmail.com" }]

router.get("/send", async (req, res) => {
  for (const user of users) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Phishing Simulation Text",
      html: generateEmailTemplate(user.id),
    }

    try {
      await transporter.sendMail(mailOptions)
      console.log(`Email sent to ${user.email}`)
    } catch {
      console.error(`Error sending email to ${user.email}:`, error)
    }
  }

  res.send("Emails sent!")
})

module.exports = router
