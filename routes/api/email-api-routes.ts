import axios from "axios"
import dotenv from "dotenv"
import express, { Request } from "express"
import pool from "../../config/database-config"
import transporter from "../../config/email-config"
import emailTemplateJobProposition from "../../templates/job-proposition/job-proposition"
import emailTemplatePassword from "../../templates/password/password"
import { UsersRow } from "../../types/database"

const router = express.Router()

dotenv.config()

// POST / -> Send Mails
router.post("/", async (req: Request, res: any) => {
  const { emails, template } = req.body

  // Check if emails
  if (emails?.length !== 0) {
    return res.status(400).json({ message: "No users selected" })
  }

  try {
    // Get users from emails
    const response = await axios.post<UsersRow[]>(
      `${process.env.HOST || `http://localhost:${process.env.PORT}`}/api/users/get`,
      { emails: emails }
    )

    const users = response.data

    // Check if users
    if (users.length === 0) {
      return res.send("No users to send emails to.")
    }

    // Prepare errors
    const errors: string[] = []

    // For each user, create email
    const emailPromises = users.map(async (user: UsersRow) => {
      let mailOptions

      // Switch case for mailOptions
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

      try {
        // If template found, send email
        if (mailOptions) {
          await transporter.sendMail(mailOptions)
        }

        const insertEmailsQuery = `
        INSERT INTO emails(user_id, template)
        VALUES ($1, $2)
        `

        // Save sent email to emails
        await pool.query(insertEmailsQuery, [user.id, template])

        console.log(`Email sent to ${user.email}`)
      } catch (error: any) {
        console.error(`Error sending email to ${user.email}:`, error)
        errors.push(`Error sending email to ${user.email}: ${error.message}`)
      }
    })

    // Wait for emails to be sent
    await Promise.all(emailPromises)

    // If errors, show
    if (errors.length !== 0) {
      return res.status(500).send(`Some emails failed to send. Errors: ${errors.join(", ")}`)
    }

    // Success
    res.send(`${users.length} Emails sent to users!`)
  } catch (error) {
    console.error("Error fetching users or sending emails:", error)
    res.status(500).send("An error occurred while sending emails.")
  }
})

export default router
