const express = require("express")
const emailRoutes = require("./routes/email-routes")
const trackingRoutes = require("./routes/tracking-routes")
const interfaceRoutes = require("./routes/interface-routes")
const authenticationRoutes = require("./routes/authentication-routes")
const apiRoutes = require("./routes/api/api-routes")
const cookieParser = require("cookie-parser")

const app = express()

app.use(express.json()) // To use JSON
app.use(express.static("public")) // To use static files from public
app.use(cookieParser()) // To handle cookies

const isAuthenticated = (req, res, next) => {
  if (req.path !== "/authentication/sign") {
    if (req.cookies.phisher) {
      return next()
    }

    // Skip redirect if api (/api/authentication... always becomes /authentication for some reason)
    if (req.path.startsWith("/api") || req.path.startsWith("/authentication")) {
      return next()
    }

    return res.redirect("/authentication/sign")
  }

  if (req.path === "/authentication/sign") {
    if (req.cookies.phisher) {
      return res.redirect("/")
    }
  }

  next()
}

app.use("/track", trackingRoutes)
app.use("/api", apiRoutes)
app.use("/authentication", authenticationRoutes)

app.use("/email", isAuthenticated, emailRoutes)
app.use("/", isAuthenticated, interfaceRoutes)

// Redirect to the main menu if route not found
app.use((req, res) => {
  res.redirect("/")
})

module.exports = app
