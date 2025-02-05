import express from "express"
import { Request, Response } from "express"
import axios from "axios"
import transporter from "../../config/email-config"
import emailTemplateJobProposition from "../../templates/job-proposition/job-proposition"
import emailTemplatePassword from "../../templates/password/password"
const router = express.Router()
import pool from "../../config/database-config"
import { UsersRow } from "../../types/database"
import dotenv from "dotenv"

dotenv.config()

router.post("/", async (req: Request, res: any) => {
  const emails = req.body.emails
  const template = req.body.template

  if (!emails || emails.length < 1) {
    return res.status(400).json({ message: "No users selected" })
  }

  try {
    // Fetch Users
    const response = await axios.post<UsersRow[]>(
      `${process.env.HOST || `http://localhost:${process.env.PORT}`}/api/users/get`,
      { emails: emails }
    )
    const users = response.data

    // If Users
    if (users.length === 0) {
      return res.send("No users to send emails to.")
    }

    // Create Emails
    const errors: string[] = []
    const emailPromises = users.map(async (user: UsersRow) => {
      let mailOptions

      switch (template) {
        case "Job Proposition":
          mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: "Nous avons trouvé de nouvelles propositions pour vous",
            html: emailTemplateJobProposition(user),
          }
          break
        case "Password Reset":
          mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: "Changez le mot de passe de votre compte SNCF",
            html: emailTemplatePassword(user),
          }
          break
        default:
          errors.push(`Template not found for ${template}`)
          break
      }

      // Send Emails
      try {
        if (mailOptions) {
          await transporter.sendMail(mailOptions)
        }

        const emailQuery = `INSERT INTO EMAILS (user_id, template) VALUES ($1, $2)`
        await pool.query(emailQuery, [user.id, template])

        console.log(`Email sent to ${user.email}`)
      } catch (error: any) {
        console.error(`Error sending email to ${user.email}:`, error)
        errors.push(`Error sending email to ${user.email}: ${error.message}`)
      }
    })

    // After all Emails sent => Show which failed
    await Promise.all(emailPromises)

    if (errors.length !== 0) {
      res.status(500).send(`Some emails failed to send. Errors: ${errors.join(", ")}`)
    } else {
      res.send(`${users.length} Emails sent to users!`)
    }
  } catch (error) {
    console.error("Error fetching users or sending emails:", error)
    res.status(500).send("An error occurred while sending emails.")
  }
})

export default router
