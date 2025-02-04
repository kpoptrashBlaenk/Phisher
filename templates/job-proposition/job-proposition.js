const fs = require("fs")
const path = require("path")

module.exports = function emailTemplateJobProposition(user) {
  const templatePath = path.join(__dirname, "job-proposition.html")
  let emailTemplate = fs.readFileSync(templatePath, "utf8")

  const baseLink = `${process.env.HOST || "http://localhost:3001"}/track/job-proposition/{{clickType}}?userId=${
    user.id
  }`

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
