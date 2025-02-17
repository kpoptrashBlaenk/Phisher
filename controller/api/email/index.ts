import dotenv from "dotenv"
import express, { Request, Response } from "express"
import transporter from "../../../config/email-config"
import emailTemplateJobProposition from "../../../templates/job-proposition/job-proposition"
import emailTemplatePassword from "../../../templates/password/password"
import { UsersRow } from "../../../types/types"
import { getUsersByEmail } from "../user/get"
import { addEmail } from "./add"

const router = express.Router()

dotenv.config()

// POST /send -> Send Mails
router.post("/send", async (req: Request, res: Response) => {
  const { emails, template } = req.body

  // Check if emails
  if (emails?.length === 0) {
    return res.status(422).send("No users selected.")
  }

  try {
    // Get users from emails
    const users = await getUsersByEmail(emails)

    // Check if users
    if (users.rowCount === 0) {
      return res.status(404).send("Users not found.")
    }

    // Prepare errors
    const errors: string[] = []

    // For each user, create email
    const emailPromises = users.rows.map(async (user: UsersRow) => {
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

          // Add email
          await addEmail(user.id, template)

          console.log(`Email sent to ${user.email}`)
        }
      } catch (error: any) {
        console.error(`Error sending email to ${user.email}:`, error)
        errors.push(`Faield to send email to ${user.email}.`)
      }
    }) // End of map

    // Wait for emails to be sent
    await Promise.all(emailPromises)

    // If errors, show
    if (errors.length !== 0) {
      return res.status(500).send(errors.join(",\n"))
    }

    // Success
    res.status(200).send(`${users.rowCount} emails sent.`)
  } catch (error) {
    console.error("Error sending emails:", error)
    return res.status(500).send("Failed to send emails.")
  }
})

export default router
