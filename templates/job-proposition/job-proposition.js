const fs = require("fs")
const path = require("path")

module.exports = function emailTemplateJobProposition(user) {
  const templatePath = path.join(__dirname, "job-proposition.html")
  let emailTemplate = fs.readFileSync(templatePath, "utf8")

  const firstName = user.name_first
  const clickLink = `${process.env.HOST || "http://localhost:3001"}/track/click?userId=${user.id}`
  const email = user.email

  emailTemplate = emailTemplate
    .replaceAll("{{firstName}}", firstName.toUpperCase())
    .replaceAll("{{clickLink}}", clickLink)
    .replaceAll("{{email}}", email)

  return emailTemplate
}
