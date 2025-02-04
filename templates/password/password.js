const fs = require("fs")
const path = require("path")

module.exports = function emailTemplatePassword(user) {
  const templatePath = path.join(__dirname, "password.html")
  let emailTemplate = fs.readFileSync(templatePath, "utf8")

  const today = new Date()
  const oneWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  const firstName = user.name_first
  const clickLink = `${process.env.HOST || "http://localhost:3001"}/track/click?userId=${user.id}`
  const maxDate = oneWeek.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  emailTemplate = emailTemplate
    .replace("{{firstName}}", firstName)
    .replace("{{clickLink}}", clickLink)
    .replace("{{maxDate}}", maxDate)

  return emailTemplate
}
