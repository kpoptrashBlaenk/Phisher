const fs = require("fs")
const path = require("path")

module.exports = function emailTemplatePassword(user) {
  const templatePath = path.join(__dirname, "password.html")
  let emailTemplate = fs.readFileSync(templatePath, "utf8")

  const baseLink = `${
    process.env.HOST || "http://localhost:3001"
  }/track/password/{{clickType}}?userId=${user.id}`
  const today = new Date()
  const oneWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  const firstName = user.name_first
  const imageLink = baseLink.replace("{{clickType}}", "image")
  const profileLink = baseLink.replace("{{clickType}}", "profile")
  const supportLink = baseLink.replace("{{clickType}}", "support")
  const maxDate = oneWeek.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  emailTemplate = emailTemplate
    .replaceAll("{{firstName}}", firstName)
    .replaceAll("{{imageLink}}", imageLink)
    .replaceAll("{{profileLink}}", profileLink)
    .replaceAll("{{supportLink}}", supportLink)
    .replaceAll("{{maxDate}}", maxDate)

  return emailTemplate
}
