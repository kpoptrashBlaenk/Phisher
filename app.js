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
  // if (req.path !== "/authentication/sign") {
  //   if (req.cookies.email) {
  //     return next()
  //   }

  //   // Skip redirect if api (/api/authentication... always becomes /authentication for some reason)
  //   if (req.path.startsWith("/api") || req.path.startsWith("/authentication")) {
  //     return next()
  //   }

  //   return res.redirect("/authentication/sign")
  // }

  next()
}

app.use("/email", isAuthenticated, emailRoutes)
app.use("/track", isAuthenticated, trackingRoutes)
app.use("/", isAuthenticated, interfaceRoutes)
app.use("/api", isAuthenticated, apiRoutes)

app.use("/authentication", authenticationRoutes)

module.exports = app
