import dotenv from "dotenv"
import fs from "fs"
import { UsersRow } from "../../types/database"
import redirection from "../../utils/redirection"

dotenv.config()

// Show the Job Proposition email template
function emailTemplateJobProposition(user: UsersRow) {
  // Get template url
  const templatePath = redirection("templates/job-proposition/job-proposition.html")
  let emailTemplate = fs.readFileSync(templatePath, "utf8")

  // Variables for replacement
  const baseLink = `${
    process.env.HOST || `http://localhost:${process.env.PORT}`
  }/track/job-proposition/{{clickType}}?userId=${user.id}`

  const firstName = user.name_first
  const messageLink = baseLink.replace("{{clickType}}", "message")
  const profileLink = baseLink.replace("{{clickType}}", "profile")
  const email = user.email

  // Replacements in html
  emailTemplate = emailTemplate
    .replaceAll("{{firstName}}", firstName.toUpperCase())
    .replaceAll("{{messageLink}}", messageLink)
    .replaceAll("{{profileLink}}", profileLink)
    .replaceAll("{{email}}", email)

  return emailTemplate
}

export default emailTemplateJobProposition
