import { UsersRow } from "../../types/database"

import fs from "fs"
import path from "path"
import redirection from "../../utils/redirection"

function emailTemplateJobProposition(user: UsersRow) {
  const templatePath = redirection("job-proposition.html")
  let emailTemplate = fs.readFileSync(templatePath, "utf8")

  const baseLink = `${
    process.env.HOST || "http://localhost:3001"
  }/track/job-proposition/{{clickType}}?userId=${user.id}`

  const firstName = user.name_first
  const messageLink = baseLink.replace("{{clickType}}", "message")
  const profileLink = baseLink.replace("{{clickType}}", "profile")
  const email = user.email

  emailTemplate = emailTemplate
    .replaceAll("{{firstName}}", firstName.toUpperCase())
    .replaceAll("{{messageLink}}", messageLink)
    .replaceAll("{{profileLink}}", profileLink)
    .replaceAll("{{email}}", email)

  return emailTemplate
}

export default emailTemplateJobProposition
